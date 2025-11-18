// backend/routes/jobRoutes.js
import express from "express";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import auth from "../middleware/auth.js";
import requireRole from "../middleware/role.js";
import { uploadResume } from "../middleware/profileupload.js"; // FIXED
import path from "path";
import fs from "fs";

const router = express.Router();

// Base URL for resume downloads (MUST BE SET IN .env)
const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");


// ==================================================
// SERVE UPLOADED RESUMES (GET /jobs/uploads/:file)
// ==================================================
router.get("/uploads/:filename", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "uploads", req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "File not found" });
    }

    return res.download(filePath);
  } catch (err) {
    console.error("FILE SERVE ERROR:", err);
    return res.status(500).json({ msg: "Error retrieving file" });
  }
});


// ==================================================
// APPLY FOR JOB (POST /jobs/apply/:id)
// Candidate only
// ==================================================
router.post(
  "/apply/:id",
  auth,
  requireRole("candidate"),
  uploadResume, // FIXED middleware
  async (req, res) => {
    try {
      const jobId = req.params.id;

      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ msg: "Job not found" });

      // Prevent duplicate application
      const exists = await Application.findOne({
        job: jobId,
        candidate: req.user.id,
      });

      if (exists) return res.status(400).json({ msg: "Already applied" });

      // Create application
      const application = await Application.create({
        job: jobId,
        candidate: req.user.id,
        coverLetter: req.body.coverLetter || "",
        resumePath: req.file?.filename || null,
        status: "Applied",
      });

      // Add candidate to job.applicants (you forgot this)
      if (!job.applicants.includes(req.user.id)) {
        job.applicants.push(req.user.id);
        await job.save();
      }

      return res.json({ msg: "Application submitted", application });
    } catch (err) {
      console.error("APPLY ERROR:", err);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);


// ==================================================
// EMPLOYER: VIEW APPLICANTS
// GET /jobs/employer/jobs/:jobId/applicants
// ==================================================
router.get(
  "/employer/jobs/:jobId/applicants",
  auth,
  requireRole("employer"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);
      if (!job) return res.status(404).json({ msg: "Job not found" });

      // Prevent unauthorized access
      if (job.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Unauthorized" });
      }

      const apps = await Application.find({ job: job._id })
        .populate("candidate", "name email")
        .sort({ createdAt: -1 });

      const formatted = apps.map((app) => ({
        _id: app._id,
        candidate: app.candidate,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumePath
          ? `${BASE_URL}/jobs/uploads/${app.resumePath}`
          : null,
        status: app.status,
        createdAt: app.createdAt,
      }));

      return res.json(formatted);
    } catch (err) {
      console.error("APPLICANTS ERROR:", err);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);


// ==================================================
// CANDIDATE: MY APPLICATIONS
// GET /jobs/my-applications
// ==================================================
router.get(
  "/my-applications",
  auth,
  requireRole("candidate"),
  async (req, res) => {
    try {
      const applications = await Application.find({ candidate: req.user.id })
        .populate("job")
        .sort({ createdAt: -1 });

      const formatted = applications.map((app) => ({
        _id: app._id,
        job: app.job,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumePath
          ? `${BASE_URL}/jobs/uploads/${app.resumePath}`
          : null,
        status: app.status,
        appliedAt: app.createdAt,
      }));

      return res.json(formatted);
    } catch (err) {
      console.error("MY APPLICATIONS ERROR:", err);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);


// ==================================================
// GET ALL JOBS
// ==================================================
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});


// ==================================================
// GET SINGLE JOB
// ==================================================
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    return res.json(job);
  } catch (err) {
    console.error("GET JOB ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});


// ==================================================
// EDIT JOB (PUT /jobs/:id)
// Employer only
// ==================================================
router.put("/:id", auth, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Allowed fields to update
    const allowed = [
      "title",
      "company",
      "description",
      "location",
      "salary",
      "jobType",
      "category",
      "requiredSkills",
      "experienceLevel",
      "resumeRequired",
      "deadline",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        job[key] = req.body[key];
      }
    });

    await job.save();
    return res.json({ msg: "Job updated", job });
  } catch (err) {
    console.error("EDIT JOB ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});


// ==================================================
// DELETE JOB (DELETE /jobs/:id)
// Employer only
// ==================================================
router.delete("/:id", auth, requireRole("employer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Delete all job applications
    await Application.deleteMany({ job: job._id });

    await job.deleteOne();
    return res.json({ msg: "Job removed" });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
