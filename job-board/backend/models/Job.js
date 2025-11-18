// backend/models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    location: { type: String, required: true, trim: true },

    salary: { type: String, trim: true, default: "" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Removed applicants[] because it’s redundant
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "remote", "contract"],
      default: "full-time",
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "expert"],
      default: "junior",
      trim: true,
    },

    deadline: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      trim: true,
    },

    companyLogo: {
      type: String,
      default: null, // more correct than empty string
    },

    resumeRequired: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add useful indexes
jobSchema.index({ title: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ location: 1 });

export default mongoose.model("Job", jobSchema);
