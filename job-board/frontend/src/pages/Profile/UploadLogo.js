// src/pages/Profile/UploadLogo.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

const UploadLogo = () => {
  const [file, setFile] = useState(null);
  const [isEmployer, setIsEmployer] = useState(false);
  const navigate = useNavigate();

  // Check role before allowing upload
  useEffect(() => {
    axiosInstance
      .get("/auth/me")
      .then((res) => {
        if (res.data.role !== "employer") navigate("/profile");
        setIsEmployer(true);
      })
      .catch(() => navigate("/login"));
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a company logo");
      return;
    }

    const fd = new FormData();
    fd.append("logo", file); // ✅ backend expects "logo"

    try {
      await axiosInstance.post("/profile/upload-logo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Company logo updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Upload failed");
    }
  };

  if (!isEmployer) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-5">Upload Company Logo</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-3 w-full mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
      >
        Upload Logo
      </button>
    </div>
  );
};

export default UploadLogo;
