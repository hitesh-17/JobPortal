import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const UserHero = () => {
  const { user, authChecked } = useAuth();
  if (!authChecked) {
    return null;
  }
  console.log("userHero", user, user.role);
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          {!user ? (
            <>
              <p className="mb-4 font-semibold text-blue-600">WELCOME BACK</p>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
                Hello,
                <span className="text-blue-600">{user.name}</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Ready to find your next opportunity? Explore new jobs and manage
                your applications.
              </p>
            </>
          ) : (
            <>
              <p className="mb-4 font-semibold text-blue-600">
                YOUR CAREER STARTS HERE
              </p>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
                Find Your
                <span className="text-blue-600"> Dream Job</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Discover exciting opportunities from companies looking for
                talented people like you.
              </p>
            </>
          )}

          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/jobs"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Find Jobs
            </Link>

            {!user ? (
              <Link
                to="/register"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Create Account
              </Link>
            ) : user?.role === "recruiter" ? (
              <>
                <Link
                  to="/recruiter/dashboard"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Recruiter Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/my-applications"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  My Applications
                </Link>
              </>
            )}

            {/* <Link
              to="/my-applications"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              My Applications
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserHero;
