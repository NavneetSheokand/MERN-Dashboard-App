import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          const response = await axios.get('http://localhost:3088/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.user) {
            login(token, response.data.user);
            toast.success('Successfully logged in with Google!');
            navigate('/dashboard');
          } else {
            throw new Error('Invalid user data');
          }
        } else {
          throw new Error('No token provided');
        }
      } catch (error) {
        console.error('Google authentication error:', error);
        toast.error('Google authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [login, navigate]);

  return <div>Processing authentication...</div>;
};

export default GoogleCallback;