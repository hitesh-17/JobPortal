import React, { useState } from "react";
import { createJob } from "../API/jobs.api";
import { Link, useNavigate } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    jobType: "full-time",
    experienceLevel: "fresher",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minSalary = Number(formData.minSalary);
    const maxSalary = Number(formData.maxSalary);

    if (minSalary < 0 || maxSalary < 0) {
      setError("Salary cannot be negative.");
      return;
    }

    if (maxSalary < minSalary) {
      setError("Maximum salary cannot be less than minimum salary.");
      return;
    }

    
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const jobData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,

        salary: {
          min: Number(formData.minSalary),
          max: Number(formData.maxSalary),
        },

        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await createJob(jobData);

      setSuccess(response.message);

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/recruiter/jobs" className="text-blue-800 p-5">
        ← Back to My Jobs
      </Link>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>

        <p className="mt-2 text-gray-600">
          Create a new job posting for candidates.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-600">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Job Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. MERN Stack Developer"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          {/* Company */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Company
            </label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Tech Solutions"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities and requirements..."
              rows="6"
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Salary
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                name="minSalary"
                value={formData.minSalary}
                onChange={handleChange}
                placeholder="Minimum salary"
                min="0"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />

              <input
                type="number"
                name="maxSalary"
                value={formData.maxSalary}
                onChange={handleChange}
                placeholder="Maximum salary"
                min="0"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Job Type
            </label>

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Experience Level
            </label>

            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
            >
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Express"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Separate skills with commas.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Job..." : "Post Job"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateJob;
