import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import AuthForm from "../components/user/AuthForm.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/auth/selectors";
import { messageResponse, statusResponse } from "../store/auth/slice";
import { loginAxios } from "../utils/interceptorApi.js";

const API_URL = import.meta.env.VITE_BACK_URL;

function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { userName, firstName, lastName, email, password };
      const res = await loginAxios.post(`/auth/signup`, body);
      setUserName("");
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      if (res.status === 201) {
        // alert("Verification email sent. Please check your inbox.");
        navigate("/login");
      }
    } catch (e) {
      dispatch(statusResponse(e.response.status));
      dispatch(messageResponse(e.response.data.message));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <AuthForm
        handleSubmit={handleSubmit}
        setPassword={setPassword}
        setUserName={setUserName}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setEmail={setEmail}
      />
    </>
  );
}

export default SignupPage;
