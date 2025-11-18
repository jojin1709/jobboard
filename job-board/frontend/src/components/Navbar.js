import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import axiosInstance from "../utils/axiosinstance";

export default function Navbar({ logout }) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef(null);

  /* ================================
       LOAD USER SAFELY (auth/me)
  ================================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setUser(null);

    axiosInstance
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const safeName = user?.name || "User";
  const role = user?.role;

  /* ================================
       LOGOUT
  ================================= */
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    logout && logout();
    navigate("/login");
  };

  /* ================================
       CLICK OUTSIDE TO CLOSE DROPDOWN
  ================================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 sticky top-0 z-50 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="font-bold text-2xl">
          JobBoard
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 font-medium bg-white text-blue-600 px-3 py-1 rounded"
              >
                <FaUserCircle size={20} />
                {safeName}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 py-2">

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/profile/edit"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>

                  {role === "candidate" && (
                    <Link
                      to="/candidate-dashboard"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Applications
                    </Link>
                  )}

                  {role === "employer" && (
                    <>
                      <Link
                        to="/employer"
                        className="block px-4 py-2 hover:bg-gray-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Post Job
                      </Link>
                      <Link
                        to="/employer/jobs"
                        className="block px-4 py-2 hover:bg-gray-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Jobs
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-4 space-y-3">

          {!user && (
            <>
              <Link to="/login" className="block hover:underline">
                Login
              </Link>

              <Link
                to="/register"
                className="block bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <p className="font-medium border-b border-blue-500 pb-2">
                <FaUserCircle className="inline mr-2" />
                {safeName} ({role})
              </p>

              <Link to="/profile" className="block hover:underline">
                Profile
              </Link>

              <Link to="/profile/edit" className="block hover:underline">
                Edit Profile
              </Link>

              {role === "candidate" && (
                <Link to="/candidate-dashboard" className="block hover:underline">
                  My Applications
                </Link>
              )}

              {role === "employer" && (
                <>
                  <Link to="/employer" className="block hover:underline">
                    Post Job
                  </Link>
                  <Link to="/employer/jobs" className="block hover:underline">
                    My Jobs
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 px-4 py-2 mt-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
