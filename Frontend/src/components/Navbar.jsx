import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser, logoutUser } from "../API/auth.api";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
  console.log("navbar user", user);
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}

        <Link to="/" className="text-2xl font-bold text-blue-600">
          HireHub
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-gray-700 transition hover:text-blue-600">
            Home
          </Link>

          <Link
            to="/jobs"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Find Jobs
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="relative">
              {/* User button */}
              <button
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100"
              >
                <span>Hi, {user.name}</span>

                <span
                  className={`text-xs transition-transform ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">

                  {user.role === "jobseeker" && (
                    <>                  <Link
                    to="/profile"
                    onClick={() => setOpenDropdown(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                    <Link
                      to="/my-applications"
                      onClick={() => setOpenDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Applications
                    </Link>

                    </>

                  )}
                  {user.role === "recruiter" && (
                    <Link
                      to="/recruiter/dashboard"
                      onClick={() => setOpenDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Recruiter Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setOpenDropdown(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
