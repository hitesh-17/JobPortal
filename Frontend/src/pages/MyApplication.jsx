import React, { useEffect, useState } from "react";
import { getMyApplication } from "../API/applications.api";
import { Link } from "react-router-dom";

const MyApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyApplication = async () =>{
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplication();
      setApplications(data.applications || [])
    } catch (error) {
       console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
   
    }
  }

  useEffect(()=>{
    fetchMyApplication()
  },[])

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
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>

          <p className="mt-2 text-gray-600">
            Track the jobs you have applied for.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              You haven't applied for any jobs yet.
            </p>

            <Link
              to="/jobs"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => (
              <div
                key={application._id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {application.job?.title}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      {application.job?.company}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      📍 {application.job?.location}
                    </p>
                  </div>

                  <div>
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium capitalize text-blue-700">
                      {application.status}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">
                    Applied on{" "}
                    {new Date(application.appliedAt).toLocaleDateString(
                      "en-IN",
                    )}
                  </p>

                  {application.job?._id && (
                    <Link
                      to={`/jobs/${application.job._id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View Job
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyApplication;
