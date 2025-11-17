import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../db.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
