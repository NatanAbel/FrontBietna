import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import AuthForm from "../component/user/AuthForm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/auth/selectors";

const API_URL = "http://localhost:5005/auth";

function SignupPage() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { userName, email, password };

      const res = await axios.post(`${API_URL}/signup`, body);
      setUserName("");
      setEmail("");
      setPassword("");
      if (res.status === 201) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e.message);
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
        setEmail={setEmail}
      />
    </>
  );
}

export default SignupPage;
