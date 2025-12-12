import React, { useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import { AuthContext } from '../Context/AuthContext'

export default function Dashboard() {
  const { logout} = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/dashboard"); // corrected route
        if (res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.log("Failed to fetch profile:", err);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Dashboard</h2>

        {profile ? (
          <div className="text-blue-700 text-lg">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        ) : (
          <p className="text-blue-500">Loading profile...</p>
        )}

        <button
          onClick={logout}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}