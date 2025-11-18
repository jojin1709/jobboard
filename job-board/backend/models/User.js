// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["candidate", "employer"],
      required: true,
      index: true,
    },

    // ========= PROFILE =========
    bio: { type: String, trim: true, default: "" },
    profilePic: { type: String, default: null },
    phone: { type: String, trim: true, default: "" },

    // ========= CANDIDATE FIELDS =========
    skills: {
      type: [String],
      default: [],
      set: v => v.map(s => s.trim().toLowerCase()),
    },

    experience: { type: String, trim: true, default: "" },
    resume: { type: String, default: null },

    // ========= EMPLOYER FIELDS =========
    companyName: { type: String, trim: true, default: "" },
    companyWebsite: { type: String, trim: true, default: "" },
    companyDescription: { type: String, trim: true, default: "" },
    companyLogo: { type: String, default: null },

    // ========= STATUS =========
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ======================================
   PASSWORD HASHING (ALWAYS SAFE)
====================================== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ======================================
   METHOD: COMPARE PASSWORDS
====================================== */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index email for fast login
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
