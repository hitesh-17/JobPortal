import { application } from "express";
import jobModel from "../models/job.model.js";
import catchAsync from "../utils/catchAsync.js";
import ApplicationModel from "../models/application.model.js";

export const getRecruiterDashboard = catchAsync(async (req, res) => {
  const recruiterId = req.user._id;

  // find all by the same recruiter
  const jobs = await jobModel
    .find({
      createdBy: recruiterId,
    })
    .select("_id isActive");

  const jobIds = jobs.map((job) => job._id);

  console.log("job id", jobIds);

  const [
    totalJobs,
    activeJobs,
    inactiveJobs,
    totalApplications,
    appliedApplications,
    reviewingApplications,
    shortlistedApplications,
    interviewApplications,
    selectedApplications,
    rejectedApplications,
  ] = await Promise.all([
    jobModel.countDocuments({
      createdBy: recruiterId,
    }),

    jobModel.countDocuments({
      createdBy: recruiterId,
      isActive: true,
    }),

    jobModel.countDocuments({
      createdBy: recruiterId,
      isActive: false,
    }),

    ApplicationModel.countDocuments({
      job: { $in: jobIds },
    }),

    ApplicationModel.countDocuments({
      job: { $in: jobIds },
      status: "applied",
    }),

    ApplicationModel.countDocuments({
      job: { $in: jobIds },
      status: "reviewing",
    }),

    ApplicationModel.countDocuments({
      job: { $in: jobIds },
      status: "shortlisted",
    }),

    ApplicationModel.countDocuments({
      job: { $in: jobIds },
      status: "interview",
    }),

    ApplicationModel.countDocuments({
      job: { $in: jobIds },
      status: "selected",
    }),

    ApplicationModel.countDocuments({
      job: { $in: jobIds },
      status: "rejected",
    }),
  ]);

  res.status(200).json({
    success: true,

    data: {
      jobs: {
        total: totalJobs,
        active: activeJobs,
        inactive: inactiveJobs,
      },

      applications: {
        total: totalApplications,
        applied: appliedApplications,
        reviewing: reviewingApplications,
        shortlisted: shortlistedApplications,
        interview: interviewApplications,
        selected: selectedApplications,
        rejected: rejectedApplications,
      },
    },
  });
});

export const getRecruiterJobs = catchAsync(async (req, res) => {
  const recruiterId = req.user._id;
console.log("recruiter ID : ",recruiterId)
  const job = await jobModel.aggregate([
    {
        $match : {
            createdBy : recruiterId
        }
    },
    {
        $lookup :{
            from : "applications",
            localField : "_id",
            foreignField : "job",
            as : "applications"
        }
    },
    {
        $addFields : {
            applicationCount : {
                $size : "$applications"
            }
        }
    },
     {
      $project: {
        applications: 0,
      },
    },
     {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

   res.status(200).json({
    success: true,
    count: job.length,
    data: job,
  });
});

export const getRecentApplications = catchAsync(async (req, res) => {
  const recruiterId = req.user._id;

  const jobs = await jobModel.find({
    createdBy: recruiterId,
  }).select("_id");

  const jobIds = jobs.map((job) => job._id);

  const applications = await ApplicationModel.find({
    job: { $in: jobIds },
  })
    .populate("applicant", "name email")
    .populate("job", "title company")
    .sort("-createdAt")
    .limit(10);

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

export const deleteJob = catchAsync(async (req, res, next) => {
  const job = await jobModel.findById(req.params.id);

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  if (
    job.createdBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError(
        "You are not allowed to delete this job",
        403
      )
    );
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
