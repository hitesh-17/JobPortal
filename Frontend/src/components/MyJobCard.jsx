import React from "react";
import { Link } from "react-router-dom";

const MyJobCard = ({ job, onDelete }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>

          <p className="mt-1 text-sm text-gray-500">{job.company}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            job.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {job.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm text-gray-600">
        <p>📍 {job.location}</p>

        <p>💼 {job.jobType}</p>

        <p>🎯 {job.experienceLevel}</p>

        <p>
          💰 ₹{job.salary.min.toLocaleString("en-IN")} - ₹
          {job.salary.max.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-gray-700">Applications</p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {job.applicationCount}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          to={`/recruiter/jobs/${job._id}/applications`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          View Applications
        </Link>

        <Link
          to={`/recruiter/jobs/${job._id}/edit`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(job._id)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MyJobCard;
