import React from 'react'
import { useState } from 'react'
import api from '../api/axios'
import { Link ,useNavigate } from 'react-router-dom'


function Login() {

  const [formData , setFormData] = useState({
    email:"",
    password:""
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => (
      {
        ...prev,
        [e.target.name]:e.target.value
      }
    ))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    // console.log(formData);
    try {
      const res = await api.post('/login' , formData)
      if(res.data.success){
        alert(res.data.message)
        localStorage.setItem("accessToken" , res.data.accessToken)
        // console.log(res.data.accessToken);
        navigate('/dashboard')
      }
    } catch (error) { 
      alert(error.response.data.message)
    }
  }

  const googleAuth = () => {
    window.location.href="http://localhost:4000/api/auth/google"
  }

  return (
    <>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <input type="email" name='email' value={formData.email} onChange={handleChange} />
      <input type="password" name='password' value={formData.password} onChange={handleChange} />
      <button>Login</button><br />
      <Link to="/register" >create new account</Link>
      <button onClick={googleAuth} >Continue with google</button>
       </form>
    </>
  )
}

export default Login