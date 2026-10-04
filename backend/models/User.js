const mongoose = require("mongoose");

// COLLECTION - USERS
// USERID - NUMBER, USERNAME - STRING, PASSWORDHASH - STRING (Stored as plain text without hashing)
const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema, "users");
