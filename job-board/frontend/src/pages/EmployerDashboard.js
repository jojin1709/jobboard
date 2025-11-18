// frontend/src/pages/EmployerDashboard.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

export default function EmployerDashboard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    jobType: "full-time",
    category: "General",
    requiredSkills: "",
    experienceLevel: "junior",
    deadline: "",
  });

  const [myJobs, setMyJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  // Protect employer route
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return navigate("/login");
    if (role !== "employer") return navigate("/");
  }, []);

  // Load jobs created by employer
  const loadMyJobs = async () => {
    try {
      const res = await axiosInstance.get("/jobs/my-jobs");
      setMyJobs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load jobs");
    }
  };

  useEffect(() => {
    loadMyJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      requiredSkills: form.requiredSkills
        ? form.requiredSkills.split(",").map((s) => s.trim())
        : [],
    };

    try {
      const res = await axiosInstance.post("/jobs", payload);
      alert("Job created!");

      setMyJobs([res.data.job, ...myJobs]);

      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        jobType: "full-time",
        category: "General",
        requiredSkills: "",
        experienceLevel: "junior",
        deadline: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create job");
    }
  };

  const startEdit = (job) => {
    setEditingJob(job);

    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      description: job.description,
      jobType: job.jobType,
      category: job.category,
      requiredSkills: job.requiredSkills.join(", "),
      experienceLevel: job.experienceLevel,
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().slice(0, 10)
        : "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      requiredSkills: form.requiredSkills
        ? form.requiredSkills.split(",").map((s) => s.trim())
        : [],
    };

    try {
      const res = await axiosInstance.put(`/jobs/${editingJob._id}`, payload);
      alert("Job updated!");

      setMyJobs(
        myJobs.map((j) =>
          j._id === editingJob._id ? res.data.job : j
        )
      );

      setEditingJob(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await axiosInstance.delete(`/jobs/${id}`);
      setMyJobs(myJobs.filter((j) => j._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>

      {/* FORM */}
      <form
        onSubmit={editingJob ? handleUpdate : handleSubmit}
        className="bg-white p-6 shadow rounded mb-10 space-y-3"
      >
        <h2 className="text-xl font-bold mb-3">
          {editingJob ? "Edit Job" : "Post a Job"}
        </h2>

        <input name="title" placeholder="Job Title" className="w-full border p-3"
          value={form.title} onChange={handleChange} required />

        <input name="company" placeholder="Company Name" className="w-full border p-3"
          value={form.company} onChange={handleChange} required />

        <input name="location" placeholder="Location" className="w-full border p-3"
          value={form.location} onChange={handleChange} required />

        <input name="salary" placeholder="Salary" className="w-full border p-3"
          value={form.salary} onChange={handleChange} />

        <textarea name="description" placeholder="Job Description" className="w-full border p-3"
          rows="4" value={form.description} onChange={handleChange} required />

        {/* Job Fields */}
        <select name="jobType" className="w-full border p-3"
          value={form.jobType} onChange={handleChange}>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
        </select>

        <input name="category" placeholder="Category" className="w-full border p-3"
          value={form.category} onChange={handleChange} />

        <input name="requiredSkills" placeholder="Skills (comma separated)"
          className="w-full border p-3" value={form.requiredSkills}
          onChange={handleChange} />

        <select name="experienceLevel" className="w-full border p-3"
          value={form.experienceLevel} onChange={handleChange}>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="expert">Expert</option>
        </select>

        <input type="date" name="deadline" className="w-full border p-3"
          value={form.deadline} onChange={handleChange} />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingJob ? "Update Job" : "Create Job"}
        </button>
      </form>

      {/* JOB LIST */}
      <h2 className="text-2xl font-bold mb-3">My Jobs</h2>

      {myJobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="grid gap-4">
          {myJobs.map((job) => (
            <div key={job._id} className="p-4 bg-white shadow rounded border">
              <h3 className="font-bold text-lg">{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>

              <div className="mt-3 flex gap-3">
                <Link to={`/job/${job._id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded">
                  View
                </Link>

                <Link to={`/employer/jobs/${job._id}/applicants`}
                  className="bg-indigo-600 text-white px-3 py-1 rounded">
                  Applicants
                </Link>

                <button onClick={() => startEdit(job)}
                  className="bg-yellow-400 px-3 py-1 rounded">
                  Edit
                </button>

                <button onClick={() => handleDelete(job._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
