import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

function OAuthLogin() {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const accessToken = searchParams.get("accessToken")

        if(!accessToken){
          return navigate('/login')
        }

        localStorage.setItem("accessToken" , accessToken)
          // Notify app about new access token so it can fetch profile / set user
          window.dispatchEvent(new Event('authLogin'));
          navigate('/dashboard')

    } , [])

  return (
    <div>Logging...</div>
  )
}

export default OAuthLogin