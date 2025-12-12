import React from 'react'
import { useEffect } from 'react'
import api from '../api/axios'

function Dashboard() {

  useEffect(() => {
    const fetchUser = async() => {
      const res = await api.get('/dashboard')
      if(res.data.success){
        console.log(res.data.user);
      }
    }

    fetchUser()
  } , [])

  return (
    <>
    <h2>Dashboard</h2>
    
    </>
  )
}

export default Dashboard