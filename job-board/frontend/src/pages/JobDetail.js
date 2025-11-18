// src/pages/JobDetail.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const API = process.env.REACT_APP_API_URL || "https://job-board-u675.onrender.com";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || null;

  /* ========================================================
      LOAD JOB AND APPLICATION STATUS
  ======================================================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Job
        const jobRes = await axiosInstance.get(`/jobs/${id}`);
        setJob(jobRes.data);

        // Check already applied
        const appsRes = await axiosInstance.get("/jobs/my-applications");
        const hasApplied = appsRes.data?.some((a) => a.job?._id === id);

        setAlreadyApplied(hasApplied);

      } catch (err) {
        console.error("JOB LOAD ERROR:", err);
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  /* ========================================================
      APPLY
  ======================================================== */
  const applyJob = async () => {
    if (!token) return navigate("/login");

    if (role === "employer") {
      alert("Employers cannot apply.");
      return;
    }

    // If resume required but candidate did not upload one
    const profileResume = user?.resume || null;

    if (job.resumeRequired && !resume && !profileResume) {
      alert("Resume is required. Upload one in your profile.");
      return;
    }

    const fd = new FormData();
    if (resume) fd.append("resume", resume);
    fd.append("coverLetter", coverLetter);

    try {
      const res = await axiosInstance.post(`/jobs/apply/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.msg || "Applied successfully!");
      setAlreadyApplied(true);

    } catch (err) {
      alert(err.response?.data?.msg || "Error applying");
    }
  };

  /* ========================================================
      RENDER
  ======================================================== */
  if (loading)
    return <p className="text-center mt-10">Loading job details...</p>;

  if (!job)
    return (
      <p className="text-center mt-10 text-red-500">Job not found.</p>
    );

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded shadow">

      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← Back to Jobs
      </Link>

      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

      <p className="text-gray-700 mb-1"><strong>Company:</strong> {job.company}</p>
      <p className="text-gray-700 mb-1"><strong>Location:</strong> {job.location}</p>
      <p className="text-gray-700 mb-1"><strong>Salary:</strong> {job.salary || "N/A"}</p>

      {job.resumeRequired ? (
        <p className="text-red-600 font-semibold mb-3">Resume Required</p>
      ) : (
        <p className="text-green-600 font-semibold mb-3">Resume NOT Required</p>
      )}

      <p className="text-gray-700 whitespace-pre-line mb-6">
        {job.description}
      </p>

      {/* Employer Restriction */}
      {role === "employer" && (
        <p className="text-red-600 font-bold">Employers cannot apply.</p>
      )}

      {/* Already Applied */}
      {role === "candidate" && alreadyApplied && (
        <button disabled className="bg-gray-400 text-white px-6 py-3 rounded cursor-not-allowed">
          Already Applied
        </button>
      )}

      {/* Candidate Application Form */}
      {role === "candidate" && !alreadyApplied && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>

          {job.resumeRequired && (
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full mb-4 border rounded p-2"
            />
          )}

          <textarea
            placeholder="Cover Letter (optional)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full border rounded p-3 mb-4"
            rows="4"
          />

          <button
            onClick={applyJob}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-500 transition"
          >
            Submit Application
          </button>
        </div>
      )}

      {!token && (
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-500 transition"
        >
          Login to Apply
        </button>
      )}
    </div>
  );
};

export default JobDetail;
