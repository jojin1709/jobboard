// src/pages/Profile/EditProfile.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/profile")
      .then((res) => setProfile(res.data))
      .catch(() => navigate("/login")); // token expired or unauthorized
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // 1️⃣ VALIDATE SKILLS
      let skillsArray = profile.skills;
      if (typeof skillsArray === "string") {
        skillsArray = skillsArray
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length);
      }

      // 2️⃣ PREPARE THE TEXT FIELDS PAYLOAD
      const payload = {
        name: profile.name,
        bio: profile.bio || "",
        phone: profile.phone || "",
        experience: profile.experience || "",
        skills: skillsArray,
        companyName: profile.companyName || "",
        companyWebsite: profile.companyWebsite || "",
        companyDescription: profile.companyDescription || "",
      };

      await axiosInstance.put("/profile", payload);

      // 3️⃣ UPLOAD PROFILE PIC
      if (profilePic) {
        const fd = new FormData();
        fd.append("picture", profilePic);
        await axiosInstance.post("/profile/upload-profile-pic", fd);
      }

      // 4️⃣ UPLOAD RESUME
      if (resume && profile.role === "candidate") {
        const fd = new FormData();
        fd.append("resume", resume);
        await axiosInstance.post("/profile/upload-resume", fd);
      }

      // 5️⃣ UPLOAD COMPANY LOGO
      if (companyLogo && profile.role === "employer") {
        const fd = new FormData();
        fd.append("logo", companyLogo);
        await axiosInstance.post("/profile/upload-logo", fd);
      }

      alert("Profile updated successfully!");
      navigate("/profile");

    } catch (err) {
      const msg = err.response?.data?.msg || "Error updating profile.";
      setErrorMsg(msg);
    }

    setLoading(false);
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-5">Edit Profile</h1>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
          {errorMsg}
        </div>
      )}

      {/* NAME */}
      <input
        type="text"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        className="w-full border p-2 mb-4"
        placeholder="Name"
      />

      {/* EMAIL (READ ONLY) */}
      <input
        type="email"
        value={profile.email}
        disabled
        className="w-full border p-2 mb-4 bg-gray-100 cursor-not-allowed"
        placeholder="Email"
      />

      {/* BIO */}
      <textarea
        value={profile.bio || ""}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        className="w-full border p-2 mb-4"
        placeholder="Short Bio"
        rows={3}
      />

      {/* PROFILE PICTURE */}
      <h3 className="font-semibold mb-2">Profile Picture</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfilePic(e.target.files[0])}
        className="mb-4"
      />

      {/* CANDIDATE FIELDS */}
      {profile.role === "candidate" && (
        <>
          <input
            type="text"
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full border p-2 mb-4"
            placeholder="Phone"
          />

          <textarea
            value={profile.experience || ""}
            onChange={(e) =>
              setProfile({ ...profile, experience: e.target.value })
            }
            className="w-full border p-2 mb-4"
            placeholder="Experience"
            rows={3}
          />

          <input
            type="text"
            value={(profile.skills || []).join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                skills: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full border p-2 mb-4"
            placeholder="Skills (comma separated)"
          />

          {/* RESUME */}
          <h3 className="font-semibold mb-2">Upload Resume</h3>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="mb-4"
          />
        </>
      )}

      {/* EMPLOYER FIELDS */}
      {profile.role === "employer" && (
        <>
          <input
            type="text"
            value={profile.companyName || ""}
            onChange={(e) =>
              setProfile({ ...profile, companyName: e.target.value })
            }
            className="w-full border p-2 mb-4"
            placeholder="Company Name"
          />

          <input
            type="text"
            value={profile.companyWebsite || ""}
            onChange={(e) =>
              setProfile({ ...profile, companyWebsite: e.target.value })
            }
            className="w-full border p-2 mb-4"
            placeholder="Company Website"
          />

          <textarea
            value={profile.companyDescription || ""}
            onChange={(e) =>
              setProfile({ ...profile, companyDescription: e.target.value })
            }
            className="w-full border p-2 mb-4"
            placeholder="Company Description"
            rows={3}
          />

          <h3 className="font-semibold mb-2">Upload Company Logo</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCompanyLogo(e.target.files[0])}
            className="mb-4"
          />
        </>
      )}

      <button
        onClick={loading ? null : handleSave}
        disabled={loading}
        className={`mt-5 bg-blue-600 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default EditProfile;
