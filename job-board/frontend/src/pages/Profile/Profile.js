// src/pages/Profile/Profile.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { Link, useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/profile")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("PROFILE ERROR:", err);
        // If error is unauthorized → token expired → go login
        if (err.response?.status === 401) {
          return navigate("/login");
        }
        setLoading(false);
      });
  }, []);

  const fallbackImg =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!profile) {
    return (
      <p className="text-center mt-10 text-red-500">
        Unable to load profile.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-5">My Profile</h1>

      {/* PROFILE PIC */}
      <img
        src={
          profile.profilePic
            ? `${API}/uploads/${profile.profilePic}`
            : fallbackImg
        }
        onError={(e) => (e.target.src = fallbackImg)}
        className="h-28 w-28 rounded-full mb-4 object-cover border"
        alt="Profile"
      />

      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Bio:</strong> {profile.bio || "—"}</p>

      {/* CANDIDATE */}
      {profile.role === "candidate" && (
        <div className="mt-5">
          <p><strong>Phone:</strong> {profile.phone || "—"}</p>
          <p><strong>Experience:</strong> {profile.experience || "—"}</p>
          <p><strong>Skills:</strong> {(profile.skills || []).join(", ") || "—"}</p>

          {profile.resume && (
            <a
              href={`${API}/uploads/${profile.resume}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline block mt-2"
            >
              Download Resume
            </a>
          )}
        </div>
      )}

      {/* EMPLOYER */}
      {profile.role === "employer" && (
        <div className="mt-5">
          <p><strong>Company:</strong> {profile.companyName || "—"}</p>
          <p><strong>Website:</strong> {profile.companyWebsite || "—"}</p>
          <p><strong>Description:</strong> {profile.companyDescription || "—"}</p>

          {profile.companyLogo && (
            <img
              src={`${API}/uploads/${profile.companyLogo}`}
              onError={(e) => (e.target.src = fallbackImg)}
              className="h-20 mt-2 rounded border"
              alt="Company Logo"
            />
          )}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex gap-3">
        <Link
          to="/profile/edit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </Link>

        <Link
          to="/profile/password"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}
