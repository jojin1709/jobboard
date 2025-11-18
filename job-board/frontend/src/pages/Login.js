// src/pages/Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user; // { id, name, email, role }

      if (!token || !user) {
        alert("Invalid server response");
        return;
      }

      // Save to localStorage ONLY (consistent with rest of app)
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect by role
      if (user.role === "employer") {
        navigate("/employer");
      } else {
        navigate("/candidate-dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />

      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
        Login
      </button>
    </form>
  );
};

export default Login;
