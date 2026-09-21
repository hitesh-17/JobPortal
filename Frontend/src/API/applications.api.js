import api from "./axios";

// jobseeker
export const applyForJob = async (JobId, applicationData = {}) => {
  const response = await api.post(`/application/${JobId}`, applicationData);
  return response.data;
};

export const getMyApplication = async () => {
  const response = await api.get("/application/my");
  return response.data;
};

// recruiter
export const getJobApplication = async(JobId) => {
  const response = await api.get(`/application/job/${JobId}`);
  return response.data;
};

export const updateApplicationStatus = async(applicationId,status) => {
  const response =await api.patch(`/application/${applicationId}/status`,{status});
  return response.data;
};
