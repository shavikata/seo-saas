const router = require("express").Router();
const db = require("../db");

router.get("/health", (req, res) => {
  res.json({ ok: true, route: "/api/health works" });
});

router.get("/dbtest", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW() as now");
    res.json({ ok: true, now: result.rows[0].now });
  } catch (err) {
    console.error("DBTEST_ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;