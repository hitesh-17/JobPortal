import React from 'react'

const ApplicationStatus = ({status }) => {
      const statusStyles = {
    applied: "bg-gray-100 text-gray-700",
    reviewing: "bg-blue-100 text-blue-700",
    shortlisted: "bg-yellow-100 text-yellow-700",
    interview: "bg-purple-100 text-purple-700",
    selected: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
     <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  )
}

export default ApplicationStatus