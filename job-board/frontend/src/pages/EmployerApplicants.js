// frontend/src/pages/EmployerApplicants.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const EmployerApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect employer route
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token) return navigate("/login");
    if (role !== "employer") return navigate("/");
  }, [navigate]);

  // Fetch applicants
  useEffect(() => {
    if (!jobId) return;

    axiosInstance
      .get(`/jobs/employer/jobs/${jobId}/applicants`)
      .then((res) => setApplicants(res.data))
      .catch((err) => {
        console.error(err);
        alert("Unable to load applicants");
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const downloadResume = (resumeUrl) => {
    if (!resumeUrl) {
      alert("Candidate has not uploaded a resume");
      return;
    }

    window.open(resumeUrl, "_blank"); // ✔ backend already gives correct URL
  };

  if (loading) return <p className="text-center mt-10">Loading applicants...</p>;

  return (
    <div className="max-w-5xl mx-auto my-8 p-6">
      <h2 className="text-3xl font-bold mb-6">Applicants</h2>

      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="space-y-5">
          {applicants.map((app) => {
            const candidate = app.candidate || {};

            return (
              <div
                key={app._id}
                className="bg-white p-5 rounded shadow border flex justify-between items-start"
              >
                {/* LEFT SIDE */}
                <div className="w-3/4">
                  <h3 className="text-xl font-bold">
                    {candidate.name || "Unknown Candidate"}
                  </h3>
                  <p className="text-gray-600">
                    {candidate.email || "No email"}
                  </p>

                  {/* STATUS */}
                  <p className="mt-2">
                    <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700">
                      Status: {app.status || "Applied"}
                    </span>
                  </p>

                  {/* COVER LETTER */}
                  {app.coverLetter && (
                    <div className="mt-3">
                      <strong>Cover Letter:</strong>
                      <p className="text-gray-700 whitespace-pre-line mt-1">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* DATE */}
                  <p className="text-xs text-gray-500 mt-3">
                    Applied: {new Date(app.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => downloadResume(app.resumeUrl)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {app.resumeUrl ? "Download Resume" : "No Resume"}
                  </button>

                  {candidate._id && (
                    <Link
                      to={`/employer/candidate/${candidate._id}`}
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployerApplicants;
