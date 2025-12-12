import { useState } from 'react'
import api from "../api/axios"
import { useNavigate ,Link} from 'react-router-dom'

function Register() {
  const [formData , setFormData] = useState({
    name:"",
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
    try {
      const res = await api.post('/register' ,formData)
      if(res.data.success){
        // console.log(res.data.message);
        alert(res.data.message)
        navigate('/login')
      }
    } catch (error) {
      // console.log(error.response.data.message);
      alert(error.response.data.message)
    }
  }
  return (
       <>
    <h1>Registration</h1>
    <form onSubmit={handleSubmit}>
      <input type="text" name='name' onChange={handleChange} value={formData.name} />
    <input type="text" name='email' onChange={handleChange} value={formData.email} />
    <input type="text" name='password' onChange={handleChange} value={formData.password} />
    <button>Registration</button>
    <Link to='/login'>already have accoount</Link>
    </form>
    </>
  )
}

export default Register