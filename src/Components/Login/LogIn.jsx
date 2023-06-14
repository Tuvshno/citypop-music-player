import '../Login/LogIn.css'
import citypop from '../Vinal/citypop.png'
import { BiArrowBack } from 'react-icons/bi'

import { useState, useRef } from 'react'
import { toggleShowLogIn, toggleIsLoggedIn, setGlobalUsername } from '../../State/LogInSlice'
import { motion } from "framer-motion"
import { useDispatch } from 'react-redux'
import axios from 'axios';

function LogIn() {

  const [isSignUp, setIsSignUp] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [retypedPassword, setRetypedPassword] = useState('')
  const [isInvalidUser, setIsInvalidUser] = useState(false)
  const [isInvalidPass, setIsInvalidPass] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [isInvalidLogin, setIsInvalidLogin] = useState(false)

  const userRef = useRef()
  const passRef = useRef()
  const retypeRef = useRef()


  const [isValidUsername, setIsValidUsername] = useState('false')

  const dispatch = useDispatch()

  const handleLogInSubmit = async (e) => {
    e.preventDefault()
    console.log(`logging in with ${username} and ${password}...`)

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      console.log(response)
      if (response.status === 200) {
        console.log('logged in success');
        dispatch(toggleShowLogIn())
        dispatch(toggleIsLoggedIn())
        dispatch(setGlobalUsername(username))
        // redirect to login or dashboard page
      }
    } catch (error) {
      console.log('error with something');
      setIsInvalidLogin(true)
      // Handle error: show error message, etc.
    }
  }

  const handleLogInState = () => {
    console.log('toggling')
    dispatch(toggleShowLogIn())
  }
  const handleSignUp = () => {
    setIsSignUp(true)
  }
  const handleReturnLogIn = () => {
    setIsSignUp(false)
  }
  const handleUserChange = (e) => {
    setUsername(e.target.value)
    setIsInvalidUser(false)
    setUserExists(false)
    setIsInvalidLogin(false)
  }
  const handlePassChange = (e) => {
    setPassword(e.target.value)
    setIsInvalidPass(false)
    setIsInvalidLogin(false)
  }
  const handleRetypedPassChange = (e) => {
    setRetypedPassword(e.target.value)
    setIsInvalidPass(false)
  }
  const handleSignUpSubmit = async (event) => {
    event.preventDefault()
    const checkUsername = checkUser()
    const checkPassword = checkPass()
    checkForm(checkUsername, checkPassword)
  }

  const checkForm = async (checkUsername, checkPassword) => {
    if (checkUsername && checkPassword) {
      console.log('submiiting to server')
      const response = await axios.post('http://localhost:5000/username', { username });
      console.log(response)
      if (response.data) {
        console.log("User exists, retry signup");
        setUserExists(true)
      } else {
        console.log("User doesn't exist, proceed signup");
        try {
          const response = await axios.post('http://localhost:5000/signup', { username, password });
          if (response.status === 201) {
            console.log('Signup successful');
            dispatch(toggleShowLogIn())
            dispatch(toggleIsLoggedIn())
            dispatch(setGlobalUsername(username))
            // redirect to login or dashboard page
          }
        } catch (error) {
          console.log(error);
          // Handle error: show error message, etc.
        }
      }

    }
    else {
      if (!checkUsername) {
        setIsInvalidUser(true)
      }
      if (!checkPassword) {
        setIsInvalidPass(true)
      }
    }
  }

  const checkUser = () => {
    // This RegExp will match any string consisting only of alphanumeric characters.
    if (/^[a-zA-Z0-9]+$/.test(username) && username.length < 44 && username.length >= 3) {
      console.log("Username is valid");
      return true
    } else {
      console.log("Username is not valid");
      return false
    }
  };

  const checkPass = () => {
    // This RegExp will match any string consisting only of alphanumeric characters.
    if (/^[a-zA-Z0-9#?!@$%^&*-]+$/.test(password) && password.length < 44 && retypedPassword === password && password.length >= 3) {
      console.log("Password is valid");
      return true
    } else {
      console.log("Password is not valid");
      return false
    }
  };

  return (
    <motion.div
      className="login-motion-container"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}  // Add exit animation
      transition={{
        duration: 0.8,
        delay: 0.25,
        ease: [0, 0.71, 0.2, 1.01]
      }}
    >
      {/* <div className='bg-image'></div> */}

      {!isSignUp && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.25,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="login-card" >
        {/* <h2>WELCOME</h2> */}
        <form id="login-form" onSubmit={handleLogInSubmit} autoComplete="off">
          <input type="text" onChange={(e) => handleUserChange(e)} id="username" placeholder="Username" required />
          <input type="password" onChange={(e) => handlePassChange(e)} id="password" placeholder="Password" required />
          {isInvalidLogin && <div className='invalid'>Invalid Username/Password</div>}
          <input type="submit" value="Log In" />
          <button id="signup-button" onClick={handleSignUp}>Sign Up</button>
        </form>
        <h2 onClick={handleLogInState}>Continue As Guest</h2>
      </motion.div>
      }

      {isSignUp && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.25,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="login-card">
        <button className="back-button" onClick={handleReturnLogIn}><BiArrowBack /> </button>
        {/* <h2>WELCOME</h2> */}
        <form onSubmit={handleSignUpSubmit} id="login-form" autoComplete="off">
          <input type="text" ref={userRef} onChange={(e) => handleUserChange(e)} id="username" placeholder="Username" autoComplete="off" required />
          <input type="password" ref={passRef} onChange={(e) => handlePassChange(e)} id="password" placeholder="Password" required />
          <input type="password" ref={retypeRef} onChange={(e) => handleRetypedPassChange(e)} id="passwordRetype" placeholder="Retype Password" required />
          {isInvalidUser && <div className='invalid'>Invalid Username</div>}
          {isInvalidPass && <div className='invalid'>Invalid Password</div>}
          {userExists && <div className='invalid'>Username Already Exists</div>}
          <input type="submit" value="Sign Up" />
        </form>
        <h2 onClick={handleLogInState}>Continue As Guest</h2>
      </motion.div>}



    </motion.div>
  )

}

export default LogIn