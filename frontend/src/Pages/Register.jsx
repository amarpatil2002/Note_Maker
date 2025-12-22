import { useContext, useState } from 'react'
import api from "../api/axios"
import { useNavigate ,Link} from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { toast } from 'react-toastify'

function Register() {
  const [formData , setFormData] = useState({
    name:"",
    email:"",
    password:""
  })
  const navigate = useNavigate()
  const {register} = useContext(AuthContext)

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
      // const res = await api.post('/register' ,formData)
      // if(res.data.success){
      //   // console.log(res.data.message);
      //   alert(res.data.message)
      //   navigate('/login')
      // }
      // OR

      const res = await register(formData)
      // alert(res.data.message)
       toast.success(res.data.message)
      navigate('/login')

    } catch (error) {
      // console.log(error.response.data.message);
      // alert(error.response.data.message)
       toast.error(error.response.data.message)
    }
  }

  
  return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-50 to-blue-100 px-6">
    <div className="bg-white w-full max-w-110 rounded-2xl shadow-xl border border-blue-100 p-10">

      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
          Create Account
        </h1>
        <p className="text-blue-500 text-sm mt-1">
          Welcome! Please enter your details to get started.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Name Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-blue-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className="px-4 py-2 rounded-xl border border-blue-300 bg-blue-50/40
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                       transition-all shadow-sm"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-blue-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            className="px-4 py-2 rounded-xl border border-blue-300 bg-blue-50/40
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                       transition-all shadow-sm"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-blue-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="px-4 py-2 rounded-xl border border-blue-300 bg-blue-50/40
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                       transition-all shadow-sm"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
           className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold
                     rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          Create Account
        </button>
      </form>

      {/* Divider */}
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-800 underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
);



}

export default Register