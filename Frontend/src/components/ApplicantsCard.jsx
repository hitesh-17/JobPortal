import React from 'react'
import StatusSelector from './StatusSelector'

const ApplicantsCard = ({application,onStatusUpdated}) => {
    const {applicant} = application
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {applicant?.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {applicant?.email}
          </p>
        </div>

        <StatusSelector
          application={application}
          onStatusUpdated={onStatusUpdated}
        />
      </div>

      {applicant?.skills?.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-gray-700">
            Skills
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {applicant.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {application.coverLetter && (
        <div className="mt-5">
          <p className="text-sm font-medium text-gray-700">
            Cover Letter
          </p>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
            {application.coverLetter}
          </p>
        </div>
      )}

      {application.resume?.url && (
        <div className="mt-5">
          <a
            href={application.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Resume
          </a>
        </div>
      )}

      <p className="mt-5 text-xs text-gray-400">
        Applied on{" "}
        {new Date(application.appliedAt).toLocaleDateString("en-IN")}
      </p>
    </div>
  
  )
}

export default ApplicantsCard