import { useState, createContext, useEffect } from "react";
import api, { setAccessToken, clearAccessToken } from "../api/axios";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  register: () => {},
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
      return await api.post("/logout");
      // console.log(res);
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
