const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../db/users.db");
console.log("✅ REAL auth.controller.js loaded");
async function register(req, res) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "password must be at least 8 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: "email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser({
      email: normalizedEmail,
      passwordHash,
      fullName,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error("REGISTER_ERROR:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign(
  { sub: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    return res.json({ token });

  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}

module.exports = { register, login };