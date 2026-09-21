import React, { useState } from "react";
import { updateApplicationStatus } from "../API/applications.api";

const StatusSelector = ({ application, onStatusUpdated }) => {
  const [status, setStatus] = useState(application.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setLoading(true);
      setError("");
      const data = await updateApplicationStatus(application._id, newStatus);

      setStatus(data.application.status);

      if (onStatusUpdated) {
        await onStatusUpdated();
      }

    } catch (error) {
      // console.error(error);
      setError(error.response?.data?.message || "Failed to update")

      setStatus(application.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="applied">Applied</option>
        <option value="reviewing">Reviewing</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="interview">Interview</option>
        <option value="rejected">Rejected</option>
        <option value="selected">Selected</option>
      </select>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default StatusSelector;
