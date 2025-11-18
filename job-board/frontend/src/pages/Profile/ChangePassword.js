// src/pages/Profile/ChangePassword.js
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = async () => {
    setErrorMsg(null);

    if (!oldPass || !newPass || !confirmPass) {
      return setErrorMsg("All fields are required.");
    }

    if (newPass.length < 6) {
      return setErrorMsg("New password must be at least 6 characters.");
    }

    if (newPass === oldPass) {
      return setErrorMsg("New password cannot match current password.");
    }

    if (newPass !== confirmPass) {
      return setErrorMsg("New password and confirm password do not match.");
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/profile/password", {
        currentPassword: oldPass,
        newPassword: newPass,
      });

      alert(res.data.msg || "Password updated successfully.");

      setOldPass("");
      setNewPass("");
      setConfirmPass("");

      navigate("/profile");
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Failed to update password.";
      setErrorMsg(msg);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>

      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMsg}
        </div>
      )}

      <input
        type="password"
        value={oldPass}
        onChange={(e) => setOldPass(e.target.value)}
        className="w-full p-2 border mb-4"
        placeholder="Current Password"
      />

      <input
        type="password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        className="w-full p-2 border mb-4"
        placeholder="New Password"
      />

      <input
        type="password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        className="w-full p-2 border mb-4"
        placeholder="Confirm New Password"
      />

      <button
        onClick={loading ? null : handleChange}
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
};

export default ChangePassword;
