import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { app } from '../../firebase'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { fetchlogin } from '../../store/auth/thunks'

function AuthForm({handleSubmit, setPassword,setUserName, setEmail}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation().pathname

  const handleGoogleClick = async() => {
    dispatch(fetchlogin("googleContinue"))
    navigate("/")
  }
  
  return (
    <div className='login-container'>
        <h1>Bietna</h1>
      <div className="auth-wrapper">
          <h1>{location === '/login' ? 'Log In' : 'Register' }</h1>
            <form onSubmit={handleSubmit} className='auth-form'>
            <label htmlFor='username'>
                <p>Username</p>
                <input name='username' id='username' type='text' onChange={e => setUserName(e.target.value)}/>
            </label>

            {location === "/signup" && 
            <label htmlFor='Email'>
                <p>Email</p>
                <input name='email' id='email' type='email' onChange={e => setEmail(e.target.value)}/>
            </label>}
            <label htmlFor='password'>
                <p>Password</p>
                <input name='password' id='password' type='password' onChange={e => setPassword(e.target.value)}/>
            </label>
            <div className='btn-container '>
                <button type='submit' className= {`btn-form ${location === '/login' ? 'logIn' : 'register'}`}>{location === '/login' ? 'Log In' : 'Register' }</button>
            </div>
            <div className='btn-container '>
                <button onClick={handleGoogleClick} type='button' className= {`btn-form ${location === '/login' ? 'logIn' : 'register'}`}>{location === '/login' ? 'LOGIN WITH GOOGLE' : 'SINGUP WITH GOOGLE'}</button>
            </div>
            </form>
      </div>
    </div>
  )
}

export default AuthForm