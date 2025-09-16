const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    firstName: {type: String, required:true},
    lastName: {type: String},
    email: {type: String},
    phone: {type: String},
    location: {type: String},
    hobby: {type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports =  mongoose.model("Table", tableSchema);