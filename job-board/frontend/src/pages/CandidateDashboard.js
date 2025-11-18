import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "https://job-board-u675.onrender.com";

const CandidateDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Protect route
  useEffect(() => {
    if (!token) return navigate("/login");
    if (role !== "candidate") return navigate("/");
    if (!user) return navigate("/login");
  }, [token, role, user, navigate]);

  // Load applications
  useEffect(() => {
    axiosInstance
      .get("/jobs/my-applications")
      .then((res) => {
        setAppliedJobs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load your applications.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg font-semibold">
        Loading your applications...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">{error}</p>
    );

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Candidate Dashboard</h1>
        <p className="text-gray-700">{user?.name}</p>
        <p className="text-gray-700">{user?.email}</p>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        My Applications ({appliedJobs.length})
      </h2>

      {appliedJobs.length === 0 ? (
        <p className="text-gray-600">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appliedJobs.map((app) => {
            const job = app.job;

            return (
              <div
                key={app._id}
                className="border rounded-lg p-5 shadow bg-white hover:shadow-lg transition"
              >
                {/* job exists */}
                {job ? (
                  <>
                    <h2 className="text-xl font-bold mb-1">{job.title}</h2>
                    <p className="text-gray-700">
                      <strong>Company:</strong> {job.company}
                    </p>
                    <p className="text-gray-700">
                      <strong>Location:</strong> {job.location}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Salary:</strong> {job.salary || "N/A"}
                    </p>
                  </>
                ) : (
                  <p className="text-red-500 font-semibold">
                    This job was removed by the employer.
                  </p>
                )}

                <p className="text-gray-600">
                  <strong>Applied On:</strong>{" "}
                  {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                </p>

                <p className="text-green-600 font-semibold mb-3">
                  Status: {app.status || "Applied"}
                </p>

                {/* Cover Letter */}
                {app.coverLetter && (
                  <div className="mb-3">
                    <strong>Cover Letter:</strong>
                    <p className="text-gray-700 whitespace-pre-line mt-1">
                      {app.coverLetter}
                    </p>
                  </div>
                )}

                {/* Resume Download - FIXED */}
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 underline mb-3"
                  >
                    Download Resume
                  </a>
                )}

                {/* View job */}
                {job && (
                  <Link
                    to={`/job/${job._id}`}
                    className="block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                  >
                    View Job
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
