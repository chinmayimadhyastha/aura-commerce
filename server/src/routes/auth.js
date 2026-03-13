const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const user = await User.create({ email, password, full_name });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email, full_name: user.full_name } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Sign in
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: "Invalid email or password" });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email, full_name: user.full_name } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user._id, email: user.email, full_name: user.full_name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update password
router.post("/update-password", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);
    user.password = password;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reset password (simplified: in production use email tokens)
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // In production: generate a reset token, store it, email the link
    // For MERN migration: we just acknowledge the request
    if (user) {
      console.log(`Password reset requested for ${email}`);
    }
    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
