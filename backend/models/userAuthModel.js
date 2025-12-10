const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String },
    refreshToken: { type: String }
}, { timestamps: true })


const userModel = mongoose.model("User", userSchema)

module.exports = userModel
