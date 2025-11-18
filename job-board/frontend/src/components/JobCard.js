import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const api = process.env.REACT_APP_API_URL; // must end with "/"

  const logoUrl =
    job.companyLogo && job.companyLogo.trim()
      ? `${api}uploads/${job.companyLogo}`
      : null;

  const isRemote =
    job.jobType?.toLowerCase() === "remote" ||
    job.location?.toLowerCase().includes("remote");

  return (
    <div className="bg-white shadow-md p-5 rounded-lg border hover:shadow-xl transition duration-200">

      {/* COMPANY LOGO OR DEFAULT ICON */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-xl">🏢</span>
          )}
        </div>

        <div>
          <h2 className="font-bold text-lg text-blue-700 hover:underline">
            <Link to={`/job/${job._id}`}>{job.title || "Untitled Job"}</Link>
          </h2>
          <p className="text-gray-700 font-medium">{job.company}</p>

          <p className="text-xs text-gray-500 mt-1">
            {(job.category || "General")} • {(job.jobType || "full-time")}
          </p>
        </div>
      </div>

      {/* DESCRIPTION PREVIEW */}
      <p className="text-gray-600 mb-3">
        {job.description?.length > 100
          ? job.description.substring(0, 100) + "..."
          : job.description}
      </p>

      {/* META INFO */}
      <div className="text-gray-700 text-sm space-y-1 mb-4">
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> {job.salary || "Not mentioned"}</p>
        <p><strong>Experience:</strong> {job.experienceLevel || "junior"}</p>
        <p>
          <strong>Posted:</strong> 
          {job.createdAt ? " " + new Date(job.createdAt).toDateString() : " Recently"}
        </p>
      </div>

      {/* REQUIRED SKILLS */}
      {!!job.requiredSkills?.length && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.requiredSkills.slice(0, 5).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* STATUS BADGE */}
      {job.status?.toLowerCase() === "closed" && (
        <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded mb-4">
          CLOSED
        </span>
      )}

      {/* REMOTE BADGE */}
      {isRemote && (
        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded ml-2">
          Remote-friendly
        </span>
      )}

      {/* CTA BUTTONS */}
      <div className="flex gap-3 mt-4">
        <Link
          to={`/job/${job._id}`}
          className="flex-1 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>

        <Link
          to={`/job/${job._id}?apply=true`}
          className="flex-1 bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
