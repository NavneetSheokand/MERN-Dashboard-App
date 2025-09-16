import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import "./App.css";
import { toast } from "react-toastify";
import { useAuth } from './AuthContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Form validation
  const validateForm = () => {
    let formErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      formErrors.email = "Email cannot be empty";
    } else if (!emailRegex.test(email)) {
      formErrors.email = "Email must include @ and .";
    }

    // Password validation
    if (!password.trim()) {
      formErrors.password = "Password cannot be empty";
    } else if (password.length < 3) {
      formErrors.password = "Password must be at least 3 characters";
    }
       
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://localhost:3088/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        login(res.data.token, res.data.user); // Use the login function from context
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return (
    <div>
      <h1>Login page</h1>
      <form onSubmit={handleLogin}>
       
        <input
          placeholder="Enter your Email Id"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateForm} // triggers validation on leaving input
        />{errors.email && (
          <p style={{ color: "red", fontSize: "14px", margin: 0 }}>{errors.email}</p>)}
      

                
        <input
          placeholder="Enter the password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validateForm} // triggers validation on leaving input
        />{errors.password && (
              <p style={{ color: "red", fontSize: "14px", margin: 0 }}>{errors.password}</p>)}
        
               
        <button type="submit">Login</button> 
        
        {/* Google login */}
         <button  type="button"
             onClick={() => {
          window.location.href = "http://localhost:3088/api/auth/google";
        }}> Sign in with Google  </button>
          
    
        <div>
          <p>Don't have any account? <Link to='/registration'>Register</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;