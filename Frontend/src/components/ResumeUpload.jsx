import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { resumeUpload } from "../API/user.api";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user,setUser } = useAuth();

  const handleFileChange = (e) => {
    const resumeFile = e.target.files[0];
    console.log(resumeFile)
    setError("");
    setSuccess("");

    if (!resumeFile) {
      setFile(null);
      return;
    }

    if (resumeFile.type !== "application/pdf") {
      setFile(null);
      setError("Only PDF files are allowed.");
      return;
    }

    setFile(resumeFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("resume",file);

      const data = await resumeUpload(formData);

      setUser((prev)=>({
        ...prev,
        resume:data.resume
      }))

      setSuccess(data.message);
      setFile(null);
    } catch (error) {
        console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to upload resume"
      );
    }finally{
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Resume</h2>

      <p className="mt-1 text-sm text-gray-500">
        Upload your resume in PDF format.
      </p>

      {/* Existing resume */}
      {user?.resume?.url && (
        <div className="mt-5 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Resume uploaded</p>

          <a
            href={user.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            View Resume
          </a>
        </div>
      )}

      {/* File input */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {user?.resume?.url ? "Replace Resume" : "Upload Resume"}
        </label>

        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
        />
      </div>

      {/* Selected file */}
      {file && (
        <p className="mt-3 text-sm text-gray-600">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}

      {/* Error */}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {/* Success */}
      {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

      {/* Upload button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Uploading..."
          : user?.resume?.url
            ? "Replace Resume"
            : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;
