import ApplicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";
import SavedJobModel from "../models/saveJob.model.js";
import UserModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

// Dashboard
export const getDashboardStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalRecruiters,
    totalJobseekers,
    totalJobs,
    activeJobs,
    totalApplications,
  ] = await Promise.all([
    UserModel.countDocuments(),
    UserModel.countDocuments({role: 'jobseeker'}),
    UserModel.countDocuments({role : 'recruiter'}),
    jobModel.countDocuments(),
    jobModel.countDocuments({ isActive: true }),
    ApplicationModel.countDocuments(),
  ])

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalRecruiters,
      totalJobseekers,
      totalJobs,
      activeJobs,
      totalApplications,
    },
  });
});

// Get All Users
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserModel.find()
    .select("-password")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});


// Get Single User
export const getUser = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id)
    .select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Delete User
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError("Admin cannot delete their own account", 400));
  }

  await UserModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// get ALL JOB

export const getAllJobsAdmin = catchAsync(async (req, res) => {
  const jobs = await jobModel.find()
    .populate("createdBy", "name email role")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

// delete Job Admin
export const deleteJobAdmin = catchAsync(async (req, res, next) => {
  const job = await jobModel.findById(req.params.id);

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  await Promise.all([
  ApplicationModel.deleteMany({ job: job._id }),
  SavedJobModel.deleteMany({ job: job._id }),
  jobModel.findByIdAndDelete(job._id),
]);

  res.status(200).json({
    success: true,
    message: "Job and related applications deleted successfully",
  });
});


// Get All Application
export const getAllApplications = catchAsync(async (req, res) => {
  const applications = await ApplicationModel.find()
    .populate("applicant", "name email")
    .populate("job", "title company location")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

