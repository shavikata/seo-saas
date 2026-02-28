// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");

/**
 * Auth middleware:
 * - Expects: Authorization: Bearer <token>
 * - Verifies token
 * - Attaches decoded payload to req.user
 *
 * Why:
 * - Keeps auth logic in one place
 * - Controllers stay clean and focus on business logic
 */
function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ error: "Authorization header must be: Bearer <token>" });
    }

    const secret = process.env.JWT_SECRET;
    // Note: Step 2 will enforce JWT_SECRET exists at startup
    if (!secret) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const payload = jwt.verify(token, secret);

    // Keep req.user minimal: only what you need downstream
    req.user = {
      id: payload.sub, // we’ll store user id in "sub" (subject) = standard practice
      email: payload.email,
    };

    return next();
  } catch (err) {
    // jwt.verify throws on expired/invalid token
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };