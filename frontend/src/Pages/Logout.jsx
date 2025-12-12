import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };

    handleLogout();
  }, [logout]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50">
      <div className="text-blue-700 text-lg font-semibold animate-pulse">
        Logging out...
      </div>
    </div>
  );
};

export default Logout;
