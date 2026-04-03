import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = import.meta.env.VITE_URL_BACK || "http://localhost:4000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async ({ email, username, password }) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { email: email || username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.token && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("rol", String(res.data.user.rol ?? ""));
        localStorage.setItem("nombre", res.data.user.nombre ?? "");
        return res.data.user;
      }

      console.error("Respuesta inválida del backend:", res.data);
      return null;
    } catch (error) {
      console.error("Error al iniciar sesión:", error?.response?.data || error.message);
      return null;
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};