import React from "react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectloading,
} from "../../store/auth/selectors";
import {Navigate} from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoading = useSelector(selectloading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  
  // Redirect if authentication failed
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Wait until authentication is determined
  if (isLoading) {
    return <p style={{marginTop:"5rem"}}>Your login has expired...<a href="/login"style={{color:"blue"}}>Back to login</a></p>;
  }

  // Render the protected page
  return <div className="profile-container">{children}</div>;

}

export default PrivateRoute;
