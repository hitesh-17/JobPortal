import React, { useEffect, useState } from "react";
import {
  getRecentApplications,
  getRecruiterDashboard,
} from "../API/recruiter.api";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import RecentApplication from "../components/RecentApplication";

const RecruiterDashBoard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recentApplications, setRecentApplications] = useState([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, applicationsResponse] = await Promise.all([
        getRecruiterDashboard(),
        getRecentApplications(),
      ]);

      setDashboard(dashboardResponse.data);
      setRecentApplications(applicationsResponse.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load recruiter dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hey!! <span>{user.name}</span>
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your jobs and track applications.
          </p>
        </div>

    <div className="flex gap-3">
      <Link
        to="/recruiter/jobs/create"
        className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800"
      >
        + Post a Job
      </Link>

      <Link
        to="/recruiter/jobs"
        className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
      >
        My Jobs
      </Link>
    </div>
  </div>


      {/* Jobs */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Jobs</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Jobs" value={dashboard.jobs.total} />

          <StatCard title="Active Jobs" value={dashboard.jobs.active} />

          <StatCard title="Inactive Jobs" value={dashboard.jobs.inactive} />
        </div>
      </div>

      {/* Applications */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Applications</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total" value={dashboard.applications.total} />

          <StatCard title="Applied" value={dashboard.applications.applied} />

          <StatCard
            title="Reviewing"
            value={dashboard.applications.reviewing}
          />

          <StatCard
            title="Shortlisted"
            value={dashboard.applications.shortlisted}
          />

          <StatCard
            title="Interview"
            value={dashboard.applications.interview}
          />

          <StatCard title="Selected" value={dashboard.applications.selected} />

          <StatCard title="Rejected" value={dashboard.applications.rejected} />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Applications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest applications received for your jobs.
            </p>
          </div>
        </div>

        {recentApplications.length === 0 ? (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No applications yet.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {recentApplications.map((application) => (
              <RecentApplication
                key={application._id}
                application={application}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecruiterDashBoard;
