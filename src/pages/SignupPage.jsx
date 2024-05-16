import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import AuthForm from '../component/user/AuthForm'
import { useNavigate } from 'react-router-dom'

const API_URL = "http://localhost:5005/auth"

function SignupPage() {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async(e)=>{
        e.preventDefault();

        try{
        const body = {userName,email, password}

        const res = await axios.post(`${API_URL}/signup`,body)

        console.log("res.data........",res.data)
        setUserName("")
        setEmail("")
        setPassword("")
        if (res.status === 201) {
            navigate('/login')
          }
    }catch(e){
        console.log(e.message)
    }
    }


  return (
    <>
    <AuthForm 
    handleSubmit={handleSubmit}
    setPassword={setPassword}
    setUserName={setUserName}
    setEmail={setEmail}
    />
    </>
  )
}

export default SignupPage;