import axios from "axios";
import { startLoading, userLogedIn } from "./slice";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";

const API_BACK_URL = import.meta.env.VITE_BACK_URL;

// bootstrapThunkLogin thunk use to keep the logged in if the user is logged in
export const bootstrapThunkLogin = async (dispatch, getState) => {
  dispatch(startLoading());
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      
      const verifyMe = await axios.get(`${API_BACK_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userVerified = verifyMe.data.verifyUser;
      console.log("userVerified....",userVerified)
      dispatch(
        userLogedIn({
          token: token,
          me: userVerified,
        })
      );
      
    } catch (err) {
      console.log("Error in bootstrapping", err);
    }
  }
};

export const fetchlogin = (userName, password) => {
  return async (dispatch, getState) => {
    const body = { userName, password };

    try {
      dispatch(startLoading());
      // condition to check while user signup using google O'auth
      if (userName === "googleContinue") {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        const result = await signInWithPopup(auth, provider);

        const body = {
          userName: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
        };
        const tokenResponse = await axios.post(
          `${API_BACK_URL}/auth/google`,
          body
        );

        const token = tokenResponse.data.token;
        localStorage.setItem("token", token);

        const verifyMe = await axios.get(`${API_BACK_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userVerified = verifyMe.data.verifyUser;

        dispatch(
          userLogedIn({
            token: token,
            me: userVerified,
          })
        );
      } else {
        const tokenResponse = await axios.post(
          `${API_BACK_URL}/auth/login`,
          body
        );

        const token = tokenResponse.data.token;
        localStorage.setItem("token", token); // sets the token to localStorage
        const verifyMe = await axios.get(`${API_BACK_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userVerified = verifyMe.data.verifyUser;
        dispatch(
          userLogedIn({
            token: token,
            me: userVerified,
          })
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };
};
