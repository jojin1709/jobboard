// src/pages/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        alert("Invalid server response");
        return;
      }

      // Store auth data (single source of truth)
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (user.role === "employer") {
        navigate("/employer");
      } else {
        navigate("/candidate-dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select
        className="border p-2 w-full mb-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="candidate">Candidate</option>
        <option value="employer">Employer</option>
      </select>

      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
        Register
      </button>
    </form>
  );
};

export default Register;
