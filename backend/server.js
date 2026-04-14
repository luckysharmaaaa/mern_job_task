require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const taskRoutes = require("./routes/tasks");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🔧 Middleware loaded");

// ========== ROUTES ==========
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);  // ✅ ADDED THIS LINE!

console.log("📍 Routes configured");

// ========== MONGODB CONNECTION ==========
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log(`✅ MongoDB Connected to: ${conn.connection.name}`);
    console.log(
      `✅ Database: ${process.env.MONGO_URI.split("/")[process.env.MONGO_URI.split("/").length - 1].split("?")[0]}`,
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 POST http://localhost:${PORT}/api/tasks - Add Task`);
      console.log(`📋 GET http://localhost:${PORT}/api/tasks - Get Tasks`);
      console.log(`📊 GET http://localhost:${PORT}/api/dashboard/stats - Dashboard Stats`);
    });
  })
  .catch((err) => {
    console.error("❌ Connection Error:", err.message);
    process.exit(1);
  });

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error("⚠️ Unhandled Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});