const express = require("express");
const router = express.Router();
const User = require("../models/User");
const getNextId = require("../utils/getNextId");

// POST /register - Register a new user (NO PASSWORD HASHING)
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required." });
        }

        // Check if username already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Username is already taken." });
        }

        // Generate auto-incremented numeric userId
        const userId = await getNextId(User, "userId");

        // Save password directly as plain text (no hashing)
        const newUser = new User({
            userId,
            username,
            passwordHash: password 
        });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: { userId, username }
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
});

// POST /login - User login (Direct plain text password comparison)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required." });
        }

        // Compare username and plain text password directly
        const user = await User.findOne({ username, passwordHash: password });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: { userId: user.userId, username: user.username }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});

module.exports = router;
