import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaRedo } from "react-icons/fa";

const JobSearch = ({ filters, setFilters }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [location, setLocation] = useState(filters.location || "");
  const [jobType, setJobType] = useState(filters.jobType || "");
  const [experienceLevel, setExperienceLevel] = useState(filters.experienceLevel || "");

  // send filters to parent (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        search: localSearch.trim(),
        location: location.trim(),
        jobType,
        experienceLevel,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, location, jobType, experienceLevel]);

  const resetFilters = () => {
    setLocalSearch("");
    setLocation("");
    setJobType("");
    setExperienceLevel("");

    setFilters({
      search: "",
      location: "",
      jobType: "",
      experienceLevel: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow p-5 rounded-lg mb-8">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Keyword Search */}
        <div className="col-span-2 flex items-center border rounded px-3 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search job title, company..."
            className="w-full outline-none"
          />
        </div>

        {/* Location */}
        <div className="flex items-center border rounded px-3 py-2">
          <FaMapMarkerAlt className="text-gray-500 mr-2" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full outline-none"
          />
        </div>

        {/* Job Type */}
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border rounded px-3 py-2 text-gray-700"
        >
          <option value="">Job Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
        </select>

        {/* Experience Level */}
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="border rounded px-3 py-2 text-gray-700"
        >
          <option value="">Experience</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="expert">Expert</option>
        </select>

      </div>

      {/* RESET BUTTON */}
      <div className="flex justify-end mt-4">
        <button
          onClick={resetFilters}
          className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          <FaRedo className="mr-2" /> Reset
        </button>
      </div>

    </div>
  );
};

export default JobSearch;
