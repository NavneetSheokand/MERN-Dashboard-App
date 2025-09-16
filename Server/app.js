require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt= require("jsonwebtoken");
const cors= require("cors");
const authRoute=require("./Routes/authRoutes");
const cookieParser = require("cookie-parser");
const passport = require("./passport.js");
const session = require("express-session");
const tableRoutes = require("./Routes/tableRoutes");



const app= express();
const PORT= 3088;
const url= process.env.MONGODB_URL;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // set true only if using HTTPS
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.urlencoded({extended: true}));
app.use(cors(
    {origin:'http://localhost:5173', credentials: true}
));

app.use("/api/auth", authRoute);
app.use("/api/table", tableRoutes);

const mongoConnect = async() =>{
    try{
        await mongoose.connect(url);
        console.log("Database connected");
    }catch(err){
        console.log("DB not connected,error:",err.message)
    }
};


app.get("/",(req,res)=>{
    res.send("API working");
});

mongoConnect().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`App running on ${PORT}`);
    });
});

