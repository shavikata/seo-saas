const express = require("express");
const app = express();

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.json());

// mount routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

// home
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});
const meRoutes = require("./routes/me.routes");
app.use("/api", meRoutes);

const projectsRoutes = require("./routes/projects.routes");
app.use("/api", projectsRoutes);

module.exports = app;