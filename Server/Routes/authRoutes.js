// authRoute.js - Fixed version
const express = require("express");
const {register, login, logout} = require("../Controllers/authControllers");
const passport = require("../passport");
const jwt = require("jsonwebtoken");
const { userVerification } = require("../Middlewares/AuthMiddlewares");
const User = require("../Models/userModel");

const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post('/login', login);
authRoute.post("/logout", logout);

authRoute.get("/verify", userVerification, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(401).json({ user: null, message: "Not authenticated" });
  }
});

// Fixed: Removed /api/auth prefix
authRoute.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Fixed: Removed /api/auth prefix
authRoute.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
    
    // Redirect to frontend with token in URL
    res.redirect(`http://localhost:5173/login?token=${token}&success=true`);
  }
);

module.exports = authRoute;