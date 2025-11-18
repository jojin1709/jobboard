// src/pages/Profile/UploadPicture.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

export default function UploadPicture() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // Check login
  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .catch(() => navigate("/login")); // token expired or not logged in
  }, []);

  const upload = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const fd = new FormData();
    fd.append("picture", file); // ✅ backend expects "picture"

    try {
      await axiosInstance.post("/profile/upload-profile-pic", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile picture updated successfully!");
      navigate("/profile");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Upload failed");
    }
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
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files[0];
          setFile(f);
          if (f) setPreview(URL.createObjectURL(f)); // preview image
        }}
        className="border p-3 w-full mb-4"
      />

      <button
        onClick={upload}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Upload
      </button>
    </div>
  );
}
