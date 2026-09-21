import ApplicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // 1. check job exists
    const job = await jobModel.findById(jobId);

    if (!job || !job.isActive) {
      return next(new AppError("Job not found or no longer active", 404));
    }

    // 2. Check if user already applied
    const existingApplication = await ApplicationModel.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return next(new AppError("You have already applied for this job", 409));
    }

    if (!req.user.resume?.url) {
      return next(
        new AppError("Please upload your resume before applying", 400),
      );
    }

    // 3. Create application
    const application = await ApplicationModel.create({
      job: jobId,
      applicant: req.user._id,
      resume: {
        url: req.user.resume?.url || "",
        publicId: req.user.resume?.publicId || "",
      },
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.find({
      applicant: req.user._id,
    })
      .populate("job", "title company location salary jobType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

export const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Find job
    const job = await jobModel.findById(jobId);

    if (!job) {
      return next(new AppError("Job not found", 404));
    }

    // Check ownership
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError("You can only view applicants for your own jobs", 403),
      );
    }

    const applications = await ApplicationModel.find({
      job: jobId,
    })
      .populate("applicant", "name email skills resume")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
    });
  }
};

export const updateApplicationStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "applied",
    "reviewing",
    "shortlisted",
    "interview",
    "rejected",
    "selected",
  ];

  console.log(status)
  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid application status", 400));
  }

  // Find application
  const application = await ApplicationModel.findById(id);
  if (!application) {
    return next(new AppError("Application not found", 404));
  }

  // Find associated job
  const job = await jobModel.findById(application.job);
  if (!job) {
    return next(new AppError("Associated job not found", 404));
  }

  // Check recruiter ownership
  if (job.createdBy.toString() !== req.user._id.toString()) {
    return next(new AppError("You cannot update this application", 403));
  }

  application.status = status;

  await application.save();

  res.status(200).json({
    success: true,
    message: "Application status updated",
    application,
  });
});
