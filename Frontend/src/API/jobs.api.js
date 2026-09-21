import api from "./axios";

// getAllJob
export const getALLJobs = async (params = {}) => {
  const response = await api.get("/job", { params });

  return response.data;
};

// getJob
export const getJobByID = async(JobId) => {
    const response = await api.get(`/job/${JobId}`);
    return response.data;
}

// getSavedJob -- get Job by IS
export const getSavedJob = async (JobId) => {
  const response = await api.get(`/save/${JobId}`);
  return response.data;
};

// Get recruiter jobs
export const getMyJobs = async () => {
  const response = await api.get("/job/my");

  return response.data;
};


// export const getSavedJobs = async () => {
//   const response = await api.get("/job/save");

//   return response.data;
// };

// recruiter create JOB
export const createJob = async (jobData) => {
  const response = await api.post("/job", jobData);

  return response.data;
};

export const updateJob = async (jobId, jobData) => {
  const response = await api.patch(`/job/${jobId}`, {jobData});

  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/job/${jobId}`);

  return response.data;
};

// export const saveJob = async (jobId) => {
//   const response = await api.post(`/job/${jobId}/save`);

//   return response.data;
// };

// export const removeSavedJob = async (jobId) => {
//   const response = await api.delete(`/job/${jobId}/save`);

//   return response.data;
// };