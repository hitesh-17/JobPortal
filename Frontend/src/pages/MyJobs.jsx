import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecruiterJobs } from "../API/recruiter.api";
import MyJobCard from "../components/MyJobCard";
import { deleteJob } from "../API/jobs.api";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecruiterJobs();

      setJobs(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this job?"
  );

  if (!confirmed) return;

  try {
    await deleteJob(jobId);

    setJobs((prevJobs) =>
      prevJobs.filter((job) => job._id !== jobId)
    );
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to delete job"
    );
  }
};

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/recruiter/dashboard"
        className="text-blue-800 py-1"
      >
        ← Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>

          <p className="mt-2 text-gray-600">
            Manage your job postings and applications.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No jobs posted yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first job posting to start receiving applications.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {jobs.map((job) => (
            <MyJobCard key={job._id} job={job} onDelete={handleDeleteJob} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyJobs;
