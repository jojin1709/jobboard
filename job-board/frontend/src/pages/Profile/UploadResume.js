// src/pages/Profile/UploadPicture.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

export default function UploadPicture() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check login
  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .catch(() => navigate("/login")); // token expired
  }, []);

  // Clean object URL memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateFile = (f) => {
    if (!f) return false;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowed.includes(f.type)) {
      alert("Only JPG, JPEG, PNG, or WEBP images are allowed.");
      return false;
    }

    if (f.size > 3 * 1024 * 1024) {
      alert("Image must be under 3MB.");
      return false;
    }

    return true;
  };

  const upload = async () => {
    if (!file) return alert("Please select an image.");

    if (!validateFile(file)) return;

    const fd = new FormData();
    fd.append("picture", file); // backend expects "picture"

    setLoading(true);

    try {
      await axiosInstance.post("/profile/upload-profile-pic", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile picture updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Upload failed.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Update Profile Picture</h1>

      {/* PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-28 w-28 rounded-full mb-4 object-cover border"
        />
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={(e) => {
          const f = e.target.files[0];
          if (!validateFile(f)) return;
          setFile(f);
          setPreview(URL.createObjectURL(f));
        }}
        className="border p-3 w-full mb-4"
      />

      <button
        onClick={loading ? null : upload}
        disabled={loading}
        className={`bg-purple-600 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
        } transition`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
