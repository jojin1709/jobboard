// backend/middleware/profileUploads.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 uploads/ folder created");
}

// Storage config
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

// Allowed types
const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const resumeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Filters
const imageFilter = (_, file, cb) => {
  if (!imageTypes.includes(file.mimetype)) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
  cb(null, true);
};

const resumeFilter = (_, file, cb) => {
  if (!resumeTypes.includes(file.mimetype)) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
  cb(null, true);
};

// FINAL EXPORTS – FIELD NAMES MATCH FRONTEND
export const uploadPicture = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("profilePic"); // ✔ matches frontend

export const uploadResume = multer({
  storage,
  fileFilter: resumeFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("resume"); // ✔ matches frontend

export const uploadLogo = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("companyLogo"); // ✔ matches frontend
