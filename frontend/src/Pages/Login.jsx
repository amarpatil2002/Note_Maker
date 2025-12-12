import { useContext, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const {login} = useContext(AuthContext)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      // const res = await api.post('/login' , formData)
      // if(res.data.success){
      //   alert(res.data.message)
      //   localStorage.setItem("accessToken" , res.data.accessToken)
      //   console.log(res.data.accessToken);
      //   navigate('/dashboard')
      // }

      // OR

      //production grade login using context API
      const res = await login(formData);
      alert(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const googleAuth = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-50 to-blue-100 px-6">
    <div className="bg-white w-full max-w-110 rounded-2xl shadow-xl border border-blue-100 p-10">

      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-blue-500 text-sm mt-1">
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">

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

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-blue-700">
            <input type="checkbox" className="w-4 h-4" />
            Remember me
          </label>

          <Link to="/forgot" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold
                     rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          Sign in
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-blue-200"></div>
        <p className="px-4 text-blue-600 text-sm">Or continue with</p>
        <div className="flex-1 h-px bg-blue-200"></div>
      </div>

      {/* Social Button */}
      <div className="flex gap-4">
        <button
          onClick={googleAuth}
          className="flex items-center justify-center gap-2 w-full py-2 border border-blue-300 rounded-xl
                     bg-blue-50/40 hover:bg-blue-100 transition font-medium text-blue-700 shadow-sm"
        >
          Continue with Google
        </button>
      </div>

      {/* Bottom Text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-700">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-800 underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  </div>
);


}


export default Login;
