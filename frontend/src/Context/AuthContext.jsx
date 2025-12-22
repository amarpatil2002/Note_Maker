import { useState, createContext, useEffect } from "react";
import api, { setAccessToken, clearAccessToken } from "../api/axios";
import { toast } from "react-toastify";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: (user) => {},
  register: (user) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        
        const res = await api.post("/refresh-token");
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);

      } catch (error) {
        clearAccessToken();
        setUser(null);  
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const login = async (formData) => {
    const res = await api.post("/login", formData);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res
  };

  const register = async (formData) => {
    return await api.post("/register", formData);
  };

  const logout = async () => {
    try {
      // If user signed in via Google, attempt to revoke token at provider
      if (user?.googleId) {
        try {
          await api.post('/revoke-google')
        } catch (err) {
          console.log('revoke-google error', err?.response?.data || err.message)
        }
      }
      const res = await api.post("/logout");
      toast.success(res.data.message)
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
