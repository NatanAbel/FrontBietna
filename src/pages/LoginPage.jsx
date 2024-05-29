import React, { useEffect } from 'react'
import { useState } from 'react'
import AuthForm from "../component/user/AuthForm"
import { useDispatch, useSelector } from 'react-redux'
import { fetchlogin } from '../store/auth/thunks'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../store/auth/selectors'

function LoginPage() {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchlogin(userName,password))
        
      }
    
    useEffect(()=>{
      if(user){
        setUserName("")
        setPassword("")
        navigate("/")
      }
    },[user,navigate])
    
  return (
    <>
    <AuthForm handleSubmit={handleSubmit} setUserName={setUserName} setPassword={setPassword}/>
    </>
  )
}

export default LoginPage;