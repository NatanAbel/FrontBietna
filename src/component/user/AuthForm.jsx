import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchlogin } from "../../store/auth/thunks";
import { selectMessage, selectStatus } from "../../store/auth/selectors";
import "./AuthForm.css";
import { toast } from "react-toastify";
import { messageResponse } from "../../store/auth/slice";

function AuthForm({
  handleSubmit,
  setPassword,
  setUserName,
  setEmail,
  setFirstName,
  setLastName,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stateMessage = useSelector(selectMessage);
  const status = useSelector(selectStatus);
  const [message, setMessage] = useState("");
  const location = useLocation().pathname;

 // Local state for username and password
 const [localUsername, setLocalUsername] = useState("");
 const [localPassword, setLocalPassword] = useState("");
 const [passwordStrength, setPasswordStrength] = useState("");

 // Password strength checker function
 const checkPasswordStrength = (password, username) => {
   let strength = 0;
   if (password.length >= 8) strength += 1; // Minimum length
   if (/[A-Z]/.test(password)) strength += 1; // Uppercase
   if (/[a-z]/.test(password)) strength += 1; // Lowercase
   if (/\d/.test(password)) strength += 1; // Number
   if (/[@$!%*?&]/.test(password)) strength += 1; // Special character
   if (password.toLowerCase().includes(username.toLowerCase()) && username.length > 0) strength -= 1; // Penalize if password contains username

   if (strength <= 2) return 'Weak';
   if (strength === 3 || strength === 4) return 'Moderate';
   if (strength >= 5) return 'Strong';
 };


  const handleGoogleClick = async () => {
    dispatch(fetchlogin("googleContinue"));
    navigate("/");
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await handleSubmit(event);
    if (response && response.message) {
      setMessage(stateMessage);
      // Navigate only if the registration/login was successful
      if (response.token || response.message.includes("User created")) {
        navigate("/");
      }
    }
  }catch (err) {
    console.log("error", err);
  }
  };

  // Update password and check strength
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setLocalPassword(newPassword);
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword, localUsername));
  };

  // Update username and check password again to avoid matching
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setLocalUsername(newUsername);
    setUserName(newUsername);
    setPasswordStrength(checkPasswordStrength(localPassword, newUsername));
  };

  // Validate username length
  const isUsernameValid = localUsername.length >= 5 && localUsername.length <= 15;
 
  

  useEffect(() => {
    if (location === "/login" || location === "/signup") {
      // dispatch(messageResponse())
      setMessage("");
    }
  }, [location]);

  useEffect(() => {
    if (status !== 201 || status !== 200) {
      setMessage(stateMessage);
      toast.success()
    }
  }, [status]);

  return (
    <div className="login-container">
      <h1>Bietna</h1>
      <div className="auth-wrapper">
        <h1>{location === "/login" ? "Log In" : "Register"}</h1>
        <form onSubmit={handleFormSubmit} className="auth-form">
           {/* Username Field */}
          <label htmlFor="username">
            <p>Username</p>
            <input
              name="username"
              id="username"
              type="text"
              onChange={handleUsernameChange}
              autoComplete="off"
              required
            />
            {location === "/signup" && !isUsernameValid && localUsername.length > 0 && (
              <p className="error-message">Username must be between 5 and 15 characters.</p>
            )}
          </label>

          {location === "/signup" && (
            <>
              <label htmlFor="Email">
                <p>FirstName</p>
                <input
                  name="firstname"
                  id="firstname"
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
              <label htmlFor="Email">
                <p>LastName</p>
                <input
                  name="lastname"
                  id="lastname"
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
              <label htmlFor="Email">
                <p>Email</p>
                <input
                  name="email"
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
            </>
          )}
          {/* Password Field */}
          <label htmlFor="password">
            <p>Password</p>
            <input
              name="password"
              id="password"
              type="password"
              onChange={handlePasswordChange}
              required
            />
            {location === "/signup" && localPassword && (
              <div className="password-strength">
                <p className={`strength-text ${
                  passwordStrength === 'Weak' ? 'weak' :
                  passwordStrength === 'Moderate' ? 'moderate' :
                  'strong'
                }`}>
                  Password Strength: {passwordStrength}
                </p>
                <div className="strength-bar">
                  <div
                    className={`bar ${
                      passwordStrength === 'Weak' ? 'bar-weak' :
                      passwordStrength === 'Moderate' ? 'bar-moderate' :
                      'bar-strong'
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </label>
           {/* Display Error Messages */}
          {message && (
            <p style={{ margin: "0 auto", color: "red" }}>{message}</p>
          )}
           {/* Submit Button */}
          <div className="btn-container ">
            <button
              type="submit"
              className={`btn-form ${
                location === "/login" ? "login" : "register"
              }`} disabled={location === "/signup" ? !isUsernameValid || passwordStrength !== 'Strong': false}
            >
              {location === "/login" ? "Log In" : "Register"}
            </button>
          </div>
          {/* Google Sign In Button */}
          <div className="btn-container">
            <button onClick={handleGoogleClick} className="gsi-material-button">
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{ display: "block" }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">
                  Sign in with Google
                </span>
                <span style={{ display: "none" }}>Sign in with Google</span>
              </div>
            </button>
          </div>
        </form>
        {/* Navigation Links */}
        <div className="account">
          {location === "/login" ? (
            <div className="account-options">
              <p className="no-account">
                <Link to="/signup" className="link">
                  Create an account
                </Link>
              </p>
              {/* <p className="forgot-password">
                <Link to="/forgot-password" className="link">
                  Credential forgotten
                </Link>
              </p> */}
            </div>
          ) : (
            <div className="have-account-option">
              <p className="have-account">
                <Link to="/login" className="link">
                  Already have an account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
