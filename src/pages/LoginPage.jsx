import React, { useEffect } from "react";
import { useState } from "react";
import AuthForm from "../components/user/AuthForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchlogin } from "../store/auth/thunks";
import { useNavigate } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectStatus,
  selectUser,
} from "../store/auth/selectors";

function LoginPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectStatus);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchlogin(userName, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      setUserName("");
      setPassword("");
      navigate("/");
    }
  }, [status, isAuthenticated, navigate]);

  return (
    <>
      <AuthForm
        handleSubmit={handleSubmit}
        setUserName={setUserName}
        setPassword={setPassword}
      />
    </>
  );
}

export default LoginPage;
