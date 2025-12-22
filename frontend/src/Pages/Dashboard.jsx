import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../Context/AuthContext";
import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/dashboard"); // corrected route
        // console.log(res);
        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.log("Failed to fetch profile:", err);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Dashboard</h2>

        <nav className="flex-1 space-y-3">
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-700 hover:bg-blue-100"
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/note"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-700 hover:bg-blue-100"
              }`
            }
          >
            Note
          </NavLink>
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
}
