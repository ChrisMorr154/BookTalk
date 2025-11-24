import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
  })
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.error("We Failed to load user profile:", err);
          setUser(null);
          localStorage.removeItem("user");
        });
    }
  }, [token]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    //save user data
    localStorage.setItem("user", JSON.stringify(userData)); 
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    //clear data when logging out
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
