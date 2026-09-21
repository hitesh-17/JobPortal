import ApplicationStatus from "./ApplicationStatus";

const RecentApplication = ({ application }) => {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 last:border-b-0 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="font-semibold text-gray-900">
          {application.applicant?.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {application.applicant?.email}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Applied for{" "}
          <span className="font-medium text-gray-900">
            {application.job?.title}
          </span>
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {new Date(
            application.createdAt
          ).toLocaleDateString("en-IN")}
        </p>
      </div>

      <ApplicationStatus status={application.status} />
    </div>
  );
};


export default RecentApplication;