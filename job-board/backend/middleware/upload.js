// backend/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads folder created:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName =
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2, 10) +
      path.extname(file.originalname);
    cb(null, safeName);
  },
});

// ACCEPT resume documents + images
const allowedFiles = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp"
];

const fileFilter = (req, file, cb) => {
  if (!allowedFiles.includes(file.mimetype)) {
    return cb(
      new Error("Only PDF, DOC, DOCX, JPG, PNG, WEBP files are allowed"),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default upload;
