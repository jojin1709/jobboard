// backend/routes/profileRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import {
  uploadPicture,
  uploadResume,
  uploadLogo,
} from "../middleware/profileUploads.js";

const router = express.Router();

/* =====================================================
   GET PROFILE  ( /profile )
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   GET /profile/me (Required by frontend)
===================================================== */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("GET PROFILE /me ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   UPDATE PROFILE (PUT /profile)
===================================================== */
router.put("/", auth, async (req, res) => {
  try {
    const updates = { ...req.body };

    // Convert skills string → array
    if (updates.skills && typeof updates.skills === "string") {
      try {
        const parsed = JSON.parse(updates.skills);
        updates.skills = parsed;
      } catch {
        updates.skills = updates.skills.split(",").map((s) => s.trim());
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    return res.json(user);
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   UPLOAD PROFILE PICTURE
   POST /profile/upload-profile-pic
===================================================== */
router.post("/upload-profile-pic", auth, uploadPicture, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);

    // Delete old picture
    if (user.profilePic) {
      const oldPath = path.join("uploads", user.profilePic);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.profilePic = req.file.filename;
    await user.save();

    res.json({ msg: "Profile picture updated", file: user.profilePic });
  } catch (err) {
    console.error("PROFILE PIC UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   UPLOAD RESUME (POST /profile/upload-resume)
===================================================== */
router.post("/upload-resume", auth, uploadResume, async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ msg: "No file uploaded" });

    const user = await User.findById(req.user.id);

    // remove old resume
    if (user.resume) {
      const oldPath = path.join("uploads", user.resume);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.resume = req.file.filename;
    await user.save();

    res.json({ msg: "Resume updated", file: user.resume });
  } catch (err) {
    console.error("RESUME UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   UPLOAD COMPANY LOGO (Employer only)
===================================================== */
router.post("/upload-logo", auth, uploadLogo, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role !== "employer") {
      return res.status(403).json({
        msg: "Only employers can upload company logos",
      });
    }

    if (!req.file)
      return res.status(400).json({ msg: "No file uploaded" });

    // remove old logo
    if (user.companyLogo) {
      const oldPath = path.join("uploads", user.companyLogo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.companyLogo = req.file.filename;
    await user.save();

    res.json({ msg: "Company logo updated", file: user.companyLogo });
  } catch (err) {
    console.error("LOGO UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =====================================================
   CHANGE PASSWORD
===================================================== */
router.post("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ msg: "Missing fields" });

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated" });
  } catch (err) {
    console.error("PASSWORD CHANGE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
