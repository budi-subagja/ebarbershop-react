import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const TIMEOUT = 1000 * 60 * 60; // 1 jam

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    if (storedUser && loginTime) {
      const expired =
        Date.now() - parseInt(loginTime) > TIMEOUT;

      if (!expired) {
        setUser(JSON.parse(storedUser));
      } else {
        handleLogout();
      }
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTime", Date.now());
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
