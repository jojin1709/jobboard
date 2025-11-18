import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";

export default function Hero({ search, setSearch }) {
  const navigate = useNavigate();

  // AUTH USER (SAFE)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axiosInstance.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handlePostJob = () => {
    if (!user) return navigate("/login");

    if (user.role !== "employer") {
      return alert("Only employers can post jobs.");
    }

    navigate("/employer");
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-4 mb-10 shadow-md">
      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Find Your Next Opportunity
        </h1>

        <p className="text-lg md:text-xl mb-8 opacity-90">
          Search through verified jobs and connect with top employers.
        </p>

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto flex bg-white rounded overflow-hidden shadow-lg">
          <input
            type="text"
            placeholder="Search job title, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 text-black outline-none"
          />
          <button
            onClick={() => {
              const section = document.getElementById("jobs-section");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-blue-600 px-6 text-white font-bold hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* CTA BUTTONS */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/candidate-dashboard")}
            className="bg-white text-blue-600 font-semibold px-5 py-2 rounded shadow hover:bg-gray-100 transition"
          >
            View My Applications
          </button>

          <button
            onClick={handlePostJob}
            className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded shadow hover:bg-yellow-300 transition"
          >
            Post a Job
          </button>
        </div>

        {/* SMALL STATS */}
        <div className="mt-10 flex justify-center gap-10 text-sm md:text-base opacity-90">
          <div>
            <strong className="text-white text-xl">500+</strong>
            <p>Active Jobs</p>
          </div>
          <div>
            <strong className="text-white text-xl">120+</strong>
            <p>Top Companies</p>
          </div>
          <div>
            <strong className="text-white text-xl">850+</strong>
            <p>Registered Candidates</p>
          </div>
        </div>

      </div>
    </section>
  );
}
