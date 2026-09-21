import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobApplication } from "../API/applications.api";
import ApplicantsCard from "../components/ApplicantsCard";

const JobApplicants = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobApplication(jobId);

      setApplications(data.applications);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">
          Loading applicants...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </section>
    );
  }

//   const job = applications[0]?.job;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Job Applicants
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {applications.length}
            {applications.length === 1
              ? "application"
              : "applications"}
          </p>
        </div>

        <Link
          to="/recruiter/jobs"
          className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to My Jobs
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No applications yet
          </h2>

          <p className="mt-2 text-gray-500">
            Candidates who apply for this job will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {applications.map((application) => (
            <ApplicantsCard
              key={application._id}
              application={application}
              onStatusUpdated={fetchApplicants}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default JobApplicants;