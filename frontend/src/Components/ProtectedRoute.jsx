import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

function ProtectedRoute() {
  const { loading } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  if (loading) return null; // wait for auth check to finish
  if (!token) return <Navigate to="/login" />;
  return <Outlet />;
}

export default ProtectedRoute;
