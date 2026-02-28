const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");

// POST register
router.post("/register", register);

// POST login
router.post("/login", login);

// Optional GET message (for browser)
router.get("/register", (req, res) => {
  res.json({ message: "Use POST /api/auth/register" });
});

module.exports = router;