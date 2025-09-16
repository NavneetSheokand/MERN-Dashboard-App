import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Check authentication status
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Check for Google OAuth callback first
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const success = urlParams.get('success');
        
        if (token && success === 'true') {
          // Verify the token from URL
          const response = await axios.get("http://localhost:3088/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
          
          if (response.data.user) {
            login(token, response.data.user);
            toast.success("Successfully logged in with Google!");
            // Redirect to dashboard
            window.location.href = '/dashboard';
            return;
          }
        }

        // Regular token verification for normal page loads
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:3088/api/auth/verify", {
          headers: { Authorization: `Bearer ${storedToken}` },
          withCredentials: true
        });

        setUser(res.data.user || null);
      } catch (err) {
        console.error("Authentication check failed:", err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
}, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;