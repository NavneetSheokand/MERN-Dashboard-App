const User= require("../Models/userModel");
require("dotenv").config();
const jwt= require("jsonwebtoken");

module.exports.userVerification = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = decoded; // contains { id: user._id }
      req.id = decoded.id;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};