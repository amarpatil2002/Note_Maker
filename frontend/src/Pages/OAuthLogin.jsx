import React from 'react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function OAuthLogin() {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const accessToken = searchParams.get("accessToken")

        if(!accessToken){
            navigate('/login')
        }

        localStorage.setItem("accessToken" , accessToken)
        navigate('/dashboard')

    } , [])

  return (
    <div>Logging...</div>
  )
}

export default OAuthLogin