import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Title & Company */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {job.title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {job.company}
        </p>
      </div>

      {/* Job information */}
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-gray-100 px-3 py-1">
          📍 {job.location}
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
          💼 {job.jobType}
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
          🎯 {job.experienceLevel}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-6 text-gray-600">
        {job.description?.slice(0, 150)}
        {job.description?.length > 150 && "..."}
      </p>

      {/* Salary */}
      <p className="mb-4 font-semibold text-gray-800">
        ₹{job.salary?.min?.toLocaleString()} - ₹
        {job.salary?.max?.toLocaleString()}
      </p>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Details button */}
      <Link
        to={`/jobs/${job._id}`}
        className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;