import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Make sure to install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setIsLoggedIn(true);
          setUserRole(decodedToken.RoleID); // Adjust based on your token structure
        } catch (error) {
          console.error("Token decoding failed:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
      setLoading(false); // Set loading to false after checking
    };

    checkAuthStatus();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    setIsLoggedIn(true);
    setUserRole(decodedToken.RoleID);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userRole, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
