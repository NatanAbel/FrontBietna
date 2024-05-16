import React from 'react'
import { useState } from 'react'
import AuthForm from "../component/user/AuthForm"
import { useDispatch } from 'react-redux'
import { fetchlogin } from '../store/auth/thunks'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchlogin(userName,password))
        setUserName("")
        setPassword("")
        navigate("/")
    }

  return (
    <>
    <AuthForm handleSubmit={handleSubmit} setUserName={setUserName} setPassword={setPassword}/>
    </>
  )
}

export default LoginPage;