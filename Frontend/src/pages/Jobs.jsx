import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";
import { getALLJobs } from "../API/jobs.api";

const DEFAULT_FILTERS = {
  search: "",
  location: "",
  jobType: "",
  experienceLevel: "",
  minSalary: "",
  maxSalary: "",
  page: 1,
  limit: 9,
  sort: "-createdAt",
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setErr(null);

      const params = Object.fromEntries(
        Object.entries(appliedFilters).filter(
          ([key, value]) =>
            value !== "" && value !== null && value !== undefined,
        ),
      );

      const data = await getALLJobs(params);

      setJobs(data.jobs || []);
      setPagination(data.pagination || null);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [appliedFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters({
      ...filters,
      page: 1,
    });
    // setFilters((prev) => ({
    //   ...prev,
    //   page: prev.page,
    // }));
  };

  console.log("search", filters);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const previousPage = () => {
    if (!pagination?.hasPreviousPage) return;
      setAppliedFilters((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));

      setFilters((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
  };

  const nextPage = () => {
    if (!pagination?.hasNextPage) return;
      setAppliedFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));

      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
  };

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>

          <p className="mt-2 text-gray-600">
            Discover your next career opportunity.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mb-6 rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search jobs, companies, skills..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Location"
              className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 md:w-52"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Job Type */}
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>

            {/* Experience */}
            <select
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All Experience</option>
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>

            {/* Minimum Salary */}
            <input
              type="number"
              name="minSalary"
              value={filters.minSalary}
              onChange={handleChange}
              placeholder="Min salary"
              className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />

            {/* Maximum Salary */}
            <input
              type="number"
              name="maxSalary"
              value={filters.maxSalary}
              onChange={handleChange}
              placeholder="Max salary"
              className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            />

            {/* Sort */}
            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="salary.min">Salary: Low → High</option>
              <option value="-salary.min">Salary: High → Low</option>
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : err ? (
          <div className="py-20 text-center">
            <p className="text-red-500">{err}</p>
          </div>
        ) : (
          <>
            {jobs.length === 0 ? (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                <p className="text-gray-500">
                  No jobs found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={previousPage}
              disabled={!pagination.hasPreviousPage}
              className="rounded-lg border border-gray-300 px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              {pagination.currentPage} /{pagination.totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={!pagination.hasNextPage}
              className="rounded-lg border border-gray-300 px-5 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;
