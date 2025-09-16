import React from "react";
import Login from "./Login";
import Registration from "./Registration";
import Dashboard from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext"; // Import AuthProvider
import GoogleCallback from './GoogleCallback';

function App() {
  return (
    <AuthProvider> 
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      

       <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} 
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;