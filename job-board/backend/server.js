// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
const app = express();

/* ================================
   CONNECT DB
================================ */
connectDB();

/* ================================
   SECURITY & LOGGING
================================ */
app.use(
  helmet({
    crossOriginResourcePolicy: false, // IMPORTANT for images
  })
);

app.use(morgan("dev"));

/* ================================
   CORS
================================ */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://job-board-u675.onrender.com", // your frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Required for preflight in production
app.options("*", cors());

/* ================================
   BODY PARSER
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================================
   STATIC FILES
================================ */
app.use("/uploads", express.static("uploads"));

/* ================================
   ROUTES
================================ */
app.get("/", (req, res) => res.send("API running..."));
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);
app.use("/profile", profileRoutes);

/* ================================
   JSON ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({ msg: "Invalid JSON format" });
  }
  next(err);
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    msg: "Server error",
    error: err.message || "Unknown error",
  });
});

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
