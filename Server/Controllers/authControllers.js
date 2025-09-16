const mongoose = require("mongoose");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");

const User= require("../Models/userModel");

//Registration Page
const register= async(req,res) =>{
    const {name, email, password}= req.body;

    //check if all required inputs are filled
    if(!name || !email ||!password){
        return res.json({success:false, message:"Missing data"});
     }
    
     try{
       const userName= await User.findOne({email});
       // Check if user already exists
     if(userName){
        return res.json({success:false, message:"User already exists"});
     }
     //If user not exists 
     const hashPassword = await bcrypt.hash(password, 10);  //Store Encrypted Password 
     const newUser= new User({name, email,password:hashPassword});
     await newUser.save(); //save user 
     console.log("Received body:", req.body);

    const token= jwt.sign({id: newUser._id}, process.env.SECRET_KEY, { expiresIn: "7d"}); //tokenization
    
    res.cookie("token",token, {
        httpOnly: true,
        secure: process.env.NODE_ENV==="production",
        sameSite: process.env.NODE_ENV ==="production"? "none" : "strict",
        maxAge: 7*24*60*60*1000,
    })
    
    return res.json({success:true, message:"user registered successfully"});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}


//Login page
const login = async (req, res) => {
 const { email, password } = req.body;

//check if all required inputs are filled
if (!email || !password) {
 return res.json({ success: false, message: "Missing data" });
 }

 try {
const user = await User.findOne({ email });
 // Check if user already exists
 if (!user) {
 return res.json({ success: false, message: "User not exists" });
 }

 //if user exists
const isMatch = await bcrypt.compare(password, user.password); //Comparing password with Encrypted Password
 if (!isMatch) {
 return res.json({ success: false, message: "Incorrect Password" });
}

 const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

 res.cookie("token", token, {
 httpOnly: true,
 secure: process.env.NODE_ENV === "production",
sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
 maxAge: 7 * 24 * 60 * 60 * 1000,
 });
 
 // ✅ Return both success flag and token
return res.json({ success: true, token, user });

} catch (err) {
 return res.json({ success: false, message: err.message });
 }
};


const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  return res.json({ message: "Logged out successfully" });
};

module.exports={register, login, logout};
