import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobByID } from "../API/jobs.api";
import { useAuth } from "../context/AuthContext";
import { applyForJob } from "../API/applications.api";

const JobDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // applyjob
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  const fetchJob = async () => {
    try {
      setLoading(true);
      setErr(null);

      const data = await getJobByID(id);

      setJob(data.job);
    } catch (error) {
      // console.error(error);

      setErr(error.response?.data?.message || "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const jobApply = async () => {
    try {
      setApplying(true);
      setApplyError("");
      setApplySuccess("");
      const data = await applyForJob(id);
      setApplySuccess(data.message);
    } catch (error) {
      // console.log("Error while Applying", error);
      setApplyError(
        error.response?.data?.message || "Job application failed to apply",
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">Loading job...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-red-500">{err}</p>

        <button
          onClick={() => navigate("/jobs")}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Job not found.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          to="/jobs"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Jobs
        </Link>

        {/* Main card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>

            <p className="mt-2 text-lg text-gray-600">{job.company}</p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-gray-100 px-4 py-2">
                📍 {job.location}
              </span>

              <span className="rounded-full bg-gray-100 px-4 py-2 capitalize">
                💼 {job.jobType}
              </span>

              <span className="rounded-full bg-gray-100 px-4 py-2 capitalize">
                🎯 {job.experienceLevel}
              </span>
            </div>
          </div>

          {/* Salary */}
          <div className="border-b border-gray-200 py-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Salary</h2>

            <p className="text-xl font-semibold text-gray-800">
              ₹{job.salary?.min?.toLocaleString("en-IN")} - ₹
              {job.salary?.max?.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 py-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Job Description
            </h2>

            <p className="whitespace-pre-line leading-7 text-gray-600">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          <div className="border-b border-gray-200 py-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Required Skills
            </h2>

            {job.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No specific skills listed.</p>
            )}
          </div>

          {/* Recruiter */}
          {job.createdBy && (
            <div className="py-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Posted By
              </h2>

              <p className="text-gray-700">{job.createdBy.name}</p>

              {job.createdBy.email && (
                <p className="mt-1 text-sm text-gray-500">
                  {job.createdBy.email}
                </p>
              )}
            </div>
          )}

          {/* Apply */}

<div className="mt-6">
  {!user ? (
    <button
      onClick={() => navigate("/login")}
      className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
    >
      Login to Apply
    </button>
  ) : user.role === "jobseeker" ? (
    user.resume?.url ? (
      <button
        onClick={jobApply}
        disabled={applying}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {applying ? "Applying..." : "Apply for this Job"}
      </button>
    ) : (
      <button
        onClick={() => navigate("/profile")}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Upload Resume to Apply
      </button>
    )
  ) : null}

  {applyError && (
    <p className="mt-3 text-center text-sm text-red-500">
      {applyError}
    </p>
  )}

  {applySuccess && (
    <p className="mt-3 text-center text-sm text-green-600">
      {applySuccess}
    </p>
  )}
</div>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
