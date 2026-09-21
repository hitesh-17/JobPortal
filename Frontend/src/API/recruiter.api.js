import api from "./axios";

export const getRecruiterDashboard = async () => {
  const response = await api.get("/recruiter/dashboard");
  return response.data;
};

export const getRecruiterJobs = async () => {
  const response = await api.get("/recruiter/jobs");
  return response.data;
};

export const getRecentApplications = async () => {
  const response = await api.get("/recruiter/applications/recent");
  return response.data;
};