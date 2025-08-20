import axios from "axios";
import {
  logout,
  messageResponse,
  startLoading,
  statusResponse,
  userLogedIn,
} from "./slice";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { loginAxios } from "../../utils/interceptorApi";

const API_BACK_URL = import.meta.env.VITE_BACK_URL;
axios.defaults.withCredentials = true;

// Logtiming for the logging function
const logTiming = (label, startTime) => {
  if (process.env.NODE_ENV === "development") {
    const duration = performance.now() - startTime;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    if (duration > 200) {
      console.warn(`Slow operation detected: ${label}`);
    }
  }
  return performance.now();
};

export const bootstrapThunkLogin = () => async (dispatch, getState) => {
  // const token = localStorage.getItem("token");
  const isAuthenticated = getState()?.auth?.isAuthenticated;

  try {
    dispatch(startLoading());
    // if (!token) return

    if (isAuthenticated) {
      const refreshResponse = await loginAxios.post("/auth/refresh",{},{
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!refreshResponse.data.accessToken) {
        throw new Error("No access token received");
      }

      const accessToken = refreshResponse.data.accessToken;

      const userVerified = await loginAxios.get("/auth/verify", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        withCredentials: true,
      });

      if (!userVerified.data.verified) {
        throw new Error("User verification failed");
      }

      const user = userVerified.data.verified;

      dispatch(
        userLogedIn({
          token: accessToken,
          me: user,
        })
      );
      return true;
    }
    return false;
  } catch (err) {
    const status = err?.response?.status || 403;
    // const message = err?.response?.data?.message || "Login failed";
    if (status === 403 || status === 401) {
      // First dispatch logout to update Redux state
      await dispatch(fetchLogOut());
      // Clear persisted state
      sessionStorage.removeItem("persist:auth");
    }

    if (process.env.NODE_ENV === "development") {
      console.error("Error in bootstrapping:", {
        status: err.response?.status,
        message: err.response?.data?.message,
      });
    }
  }
};

export const fetchlogin = (userName, password) => {
  return async (dispatch) => {
    const totalStart = performance.now();
    const startTime = performance.now();
    try {
      let timeMarker = totalStart;
      dispatch(startLoading());

      timeMarker = logTiming("Dispatch loading", timeMarker);

      const body = { userName, password };

      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      // condition to check while user signup using google O'auth
      if (userName === "googleContinue") {
        const result = await signInWithPopup(auth, provider);

        const nameParts = result.user.displayName.trim().split(" ");

        const firstName = nameParts[0]; // First word
        const lastName =
          nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Last word

        const response = await axios.post(`${API_BACK_URL}/auth/google`, {
          userName: result.user.displayName,
          email: result.user.email,
          firstName,
          lastName,
          profilePicture: result.user.photoURL,
        });

        const token = response.data.accessToken;
        // localStorage.setItem("token", token);

        const verifyMe = await axios.get(`${API_BACK_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userVerified = verifyMe.data.verified;
        dispatch(userLogedIn({ token, me: userVerified }));
      } else {
        // Main login request with optimized settings
        const response = await loginAxios.post("/auth/login", body, {
          headers: {
            "Cache-Control": "no-cache",
            "x-requested-with": "XMLHttpRequest",
          },
          // Abort request if it takes too long
          // signal: AbortSignal.timeout(2000)
        });

        timeMarker = logTiming("Login request", timeMarker);

        const token = response.data.accessToken;

        // Update UI immediately
        dispatch(
          userLogedIn({
            token,
            me: null,
            isAuthenticated: true,
          })
        );
        dispatch(statusResponse(response.status));

        // Start verification in background without waiting to verify the user
        Promise.resolve().then(() => {
          loginAxios
            .get("/auth/verify", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache",
              },
              // timeout: 1500
            })
            .then((verifyMe) => {
              if (verifyMe.data.verified) {
                dispatch(
                  userLogedIn({
                    token,
                    me: verifyMe.data.verified,
                    isAuthenticated: true,
                  })
                );
              }
            })
            .catch((err) => {
              console.warn("Verification warning:", err);
            });
        });

        const duration = performance.now() - startTime;
        if (process.env.NODE_ENV === "development") {
          console.log(`Login completed in ${duration}ms`);
          if (duration > 500) {
            console.warn(`Slow login detected: ${duration}ms`);
          }
        }
        // Log the total login flow time
        logTiming("Total login flow", totalStart);
      }
    } catch (err) {
      // Log the error handling time
      logTiming("Error handling", totalStart);

      // Secure error handling
      const status = err?.response?.status || 500;

      // Only show generic messages in production
      if (process.env.NODE_ENV === "production") {
        // Generic error messages for users
        if (status === 401) {
          dispatch(messageResponse("Invalid credentials"));
        } else {
          dispatch(messageResponse("An error occurred during login"));
        }
        dispatch(statusResponse(status));
      } else {
        // Detailed errors only in development
        const message = err?.response?.data?.message || "Login failed";
        dispatch(statusResponse(status));
        dispatch(messageResponse(message));
        console.error("Login error:", {
          status,
          message,
          // Avoid logging sensitive data
          path: err?.config?.url,
          method: err?.config?.method,
        });
      }
    }
  };
};

export const refresh = async (dispatch) => {
  try {
    await loginAxios.post("/auth/refresh");
  } catch (err) {
    console.error(err);
  }
};

export const fetchLogOut = () => async (dispatch) => {
  try {
    dispatch(logout());
    sessionStorage.removeItem("persist:auth");
    await loginAxios.get("/auth/logout");
  } catch (err) {
    dispatch(logout());
    sessionStorage.removeItem("persist:auth");
  }
};
