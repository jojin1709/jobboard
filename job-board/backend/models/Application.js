// backend/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    // Only store the filename
    resumePath: {
      type: String,
      trim: true,
      default: "",
    },

    // Hiring status
    status: {
      type: String,
      enum: ["Applied", "Viewed", "Shortlisted", "Rejected", "Interview", "Hired"],
      default: "Applied",
    },

    // Employer notes (internal only)
    employerNotes: {
      type: String,
      trim: true,
      default: "",
    },

    // Snapshot of applicant when applying
    candidateSnapshot: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
    },

    // Snapshot of job when applied
    jobSnapshot: {
      title: { type: String, trim: true },
      company: { type: String, trim: true },
      salary: { type: String, trim: true },
      location: { type: String, trim: true },
      type: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

// Prevent duplicates at DB level
applicationSchema.index(
  { job: 1, candidate: 1 },
  { unique: true }
);

export default mongoose.model("Application", applicationSchema);
