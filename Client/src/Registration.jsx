import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Registration.css";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorTimer, setErrorTimer] = useState(null);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (errorTimer) clearTimeout(errorTimer);
    };
  }, [errorTimer]);

  const validateForm = () => {
    let formErrors = {};

    // name validation
    if (!name.trim()) {
      formErrors.name = "Name cannot be empty";
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      formErrors.email = "Email cannot be empty";
    } else if (!emailRegex.test(email)) {
      formErrors.email = "Enter a valid email (must include @ and .)";
    }

    // password validation (at least 1 letter + 1 symbol + min 6 chars)
    const passwordRegex = /^(?=.*[A-Za-z])[A-Za-z\d]{3,}$/;
    if (!password) {
      formErrors.password = "Password cannot be empty";
    } else if (!passwordRegex.test(password)) {
      formErrors.password = "Wrong Password";
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  // Function to show error message and set timer to clear it
  const showError = (message) => {
    // Clear any existing timer
    if (errorTimer) clearTimeout(errorTimer);
    
    // Set the error message
    setErrorMessage(message);
    
    // Set a timer to clear the error after 10 seconds
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    
    setErrorTimer(timer);
  };

  //  Handling registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // check form validations
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://localhost:3088/api/auth/register",
        { name, email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Registered Successfully");
        window.location.href = "/login";
      } else {
        showError(res.data.message || "Registration Failed");
      }
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h1>Registration Page</h1>
      
      {/* Error message display */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div>
          <input
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p style={{ color: "red", fontSize: "14px" }}>{errors.name}</p>}
        </div>

        <div>
          <input
            placeholder="Enter your Email Id"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>}
        </div>

        <div>
          <input
            placeholder="Enter the password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "14px" }}>{errors.password}</p>
          )}
        </div>
        
        <div>
          <button type="submit">Register</button>
        </div>
        
        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </form>
      
      
    </div>
  );
}

export default Registration;