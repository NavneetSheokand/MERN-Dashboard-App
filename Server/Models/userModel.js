const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String},  //for manual login
    googleId: { type: String } //for google OAuth
});

module.exports = mongoose.model("User",userSchema);