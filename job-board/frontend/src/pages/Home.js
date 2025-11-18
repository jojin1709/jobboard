import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import JobSearch from "../components/JobSearch";
import Pagination from "../components/Pagination";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    experience: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  // Fetch jobs
  useEffect(() => {
    axiosInstance
      .get("/jobs")
      .then((res) => {
        // Ensure safe data + sort newest first
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setJobs(sorted);
        setFilteredJobs(sorted);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load jobs.");
        setLoading(false);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    const s = filters.search.toLowerCase();
    const loc = filters.location.toLowerCase();
    const type = filters.jobType.toLowerCase();
    const exp = filters.experience.toLowerCase();

    let results = jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const category = job.category?.toLowerCase() || "";
      const skills = job.requiredSkills?.join(" ").toLowerCase() || "";
      const jobLoc = job.location?.toLowerCase() || "";
      const jobTypeVal = job.jobType?.toLowerCase() || "";
      const jobExp = job.experienceLevel?.toLowerCase() || "";

      // text search
      const searchMatch =
        !s ||
        title.includes(s) ||
        company.includes(s) ||
        description.includes(s) ||
        category.includes(s) ||
        skills.includes(s);

      // location
      const locationMatch = !loc || jobLoc.includes(loc);

      // job type
      const jobTypeMatch = !type || type === jobTypeVal;

      // experience
      const expMatch = !exp || exp === jobExp;

      return searchMatch && locationMatch && jobTypeMatch && expMatch;
    });

    setFilteredJobs(results);
    setCurrentPage(1);
  }, [filters, jobs]);

  // Pagination
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  // UI
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">

      <Hero
        search={filters.search}
        setSearch={(value) =>
          setFilters((prev) => ({ ...prev, search: value }))
        }
      />

      <div className="max-w-6xl mx-auto my-6">
        <JobSearch filters={filters} setFilters={setFilters} />
      </div>

      <div className="max-w-6xl mx-auto mb-4 text-gray-700 font-medium">
        {filteredJobs.length} Jobs Found
      </div>

      <div id="jobs-section" className="max-w-6xl mx-auto">
        {currentJobs.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">
            No jobs match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
