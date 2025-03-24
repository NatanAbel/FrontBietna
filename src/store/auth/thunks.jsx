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
import { authApi } from "../../utils/interceptorApi";

const API_BACK_URL = import.meta.env.VITE_BACK_URL;
axios.defaults.withCredentials = true;

export const bootstrapThunkLogin =()=> async (dispatch, getState) => {
  // const token = localStorage.getItem("token");
  const isAuthenticated = getState()?.auth?.isAuthenticated;
  
  try {
    dispatch(startLoading());
    // if (!token) return

    if(isAuthenticated){
      const verifyMe = await axios.get(`${API_BACK_URL}/auth/refresh`);

    const accessToken = verifyMe.data.accessToken;

    const userVerified = await axios.get(`${API_BACK_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userVerified.data.verified;


    dispatch(
      userLogedIn({
        token: accessToken,
        me: user,
      })
    );

    return accessToken;
  }
  } catch (err) {
    
    const status = err?.response?.status || 403;
    // const message = err?.response?.data?.message || "Login failed";
    if(status === 403 ){
      // dispatch(statusResponse(status));
      sessionStorage.removeItem("persist:auth"); // Clear persisted state
      // dispatch(messageResponse("Your login has expired"));
      dispatch(logout())
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Error in bootstrapping:', {
        status: err.response?.status,
        message: err.response?.data?.message
      });
    }
    
  }
};

export const fetchlogin = (userName, password) => {
  return async (dispatch) => {
    try {
      dispatch(startLoading());
      // // Create the configuration
      // const config = {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Requested-With': 'XMLHttpRequest'
      //   },
      //   withCredentials: true,
      // };

      const body = { userName, password};

      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      // condition to check while user signup using google O'auth
      if (userName === "googleContinue") {

        const result = await signInWithPopup(auth, provider);

        const nameParts = result.user.displayName.trim().split(" ");
  
        const firstName = nameParts[0]; // First word
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Last word

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

        const response = await authApi.post(`${API_BACK_URL}/auth/login`, body);
        const token = response.data.accessToken;

        dispatch(statusResponse(response.status));

        const verifyMe = await authApi.get(`${API_BACK_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userVerified = verifyMe.data.verified;

        dispatch(userLogedIn({ token: token, me: userVerified }));
      }
    } catch (err) {
      // Secure error handling
      const status = err?.response?.status || 500;
      
      // Only show generic messages in production
      if (process.env.NODE_ENV === 'production') {
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
        console.error('Login error:', {
          status,
          message,
          // Avoid logging sensitive data
          path: err?.config?.url,
          method: err?.config?.method
        });
      }
      
    }
  };
};

export const refresh = async (dispatch) => {
  try {
    await axios.get(`${API_BACK_URL}/auth/refresh`);
  } catch (err) {
    console.error(err);
  }
};

export const fetchLogOut = async (dispatch) => {
  try {
    dispatch(logout());
    await axios.get(`${API_BACK_URL}/auth/logout`);
  } catch (err) {
    console.error(err);
  }
};
