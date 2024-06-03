import React, { Children, useEffect } from "react";
import { useSelector } from "react-redux";
import {selectIsAuthenticated, selectUser, selectloading} from "../../store/auth/selectors";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function PrivateRoute({children}) {
  const currentUser = useSelector(selectUser);
  const isLoading = useSelector(selectloading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && isLoading) {
        navigate("/login");
      }
  }, [currentUser,isLoading]);

return currentUser ?  <div className='profile-container' >{children}</div>: <p>loading.....</p>;

}

export default PrivateRoute;
