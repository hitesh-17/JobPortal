import ApplicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";
import SavedJobModel from "../models/saveJob.model.js";
import APIFeatures from "../utils/ApiFeatures.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const createJob = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    company,
    location,
    salary,
    jobType,
    experienceLevel,
    skills,
  } = req.body;

  const job = await jobModel.create({
    title,
    description,
    company,
    location,
    salary,
    jobType,
    experienceLevel,
    skills,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Job created successfully",
    job,
  });
});

// export const getAllJob = catchAsync(async (req, res, next) => {
//   // search
//   let query = jobModel.find({ isActive: true });
//   if (req.query.search) {
//     const searchRegex = new RegExp(req.query.search, "i");
//     query = query.find({
//       $or: [
//         { title: searchRegex },
//         { description: searchRegex },
//         { company: searchRegex },
//         { skills: searchRegex },
//         { location: searchRegex },
//       ],
//     });
//   }

//   // salary
//   if (req.query.salary) {
//     let queryStr = JSON.stringify(req.query.salary);
//     queryStr = JSON.parse(
//       queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`),
//     );

//     query = query.find(queryStr);
//   }

//   const features = new APIFeatures(query, req.query).filter().sort().paginate();

//   const jobs = await features.query.populate("createdBy", "name email");

//   res.status(200).json({
//     success: true,
//     count: jobs.length,
//     jobs,
//   });
// });

export const getAllJob = catchAsync(async (req, res, next) => {
  const {
    search,
    location,
    jobType,
    experienceLevel,
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  const currentPage = Math.max(Number(page), 1);
  const jobsPerPage = Math.min(Math.max(Number(limit), 1), 100);

  const filter = {
    isActive: true,
  };

  // Search
  if (search) {
    const searchRegex = new RegExp(search, "i");

    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { company: searchRegex },
      { skills: searchRegex },
    ];
  }

  // Location
  if (location) {
    filter.location = new RegExp(location, "i");
  }
  // Job type
  if (jobType) {
    filter.jobType = jobType;
  }

  // Experience
  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  // Salary
  if (minSalary || maxSalary) {
    // filter["salary.max"] = {};

    if (minSalary) {
      filter["salary.min"] = { $gte: Number(minSalary) };
    }

    // {salary.min : { $lte : 30000}}
    if (maxSalary) {
      filter["salary.max"] = { $lte: Number(maxSalary) };
    }
  }

  const skip = (currentPage - 1) * jobsPerPage;
  console.log(filter);
  const [jobs, totalJobs] = await Promise.all([
    jobModel
      .find(filter)
      .populate("createdBy", "name email")
      .sort(sort.split(",").join(" "))
      .skip(skip)
      .limit(jobsPerPage),

    jobModel.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  res.status(200).json({
    success: true,

    pagination: {
      totalJobs,
      currentPage,
      totalPages,
      limit: jobsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },

    jobs,
  });
});

export const getMyJobs = catchAsync(async (req, res) => {
  const jobs = await jobModel
    .find({
      createdBy: req.user._id,
    })
    .populate("createdBy", "name email")
    .sort("-createdAt");

  const activeJob = (await jobModel.find({ isActive: true })).length;

  const inActiveJob = jobs.length - activeJob;
  res.status(200).json({
    success: true,
    stats: {
      totalJobs: jobs.length,
      activeJob,
      inActiveJob,
    },
    jobs,
  });
});

export const getJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const job = await jobModel
    .findOne({
      _id: id,
      isActive: true,
    })
    .populate("createdBy", "name email");

  if (!job) {
    return new AppError("No job found", 400);
  }

  res.status(200).json({
    success: true,
    count: job.length,
    job,
  });
});

export const updateJob = catchAsync(async (req, res,next) => {
  const { id } = req.params;

  const updateData = req.body;

// nothing in body to change
  if(updateData === undefined){
    return next(new AppError("Define fieled to change", 400));
  }

  const job = await jobModel
    .findOne({
      _id: id,
      isActive: true,
    })
    .populate("createdBy", "name email");

  if (!job) {
    return next(new AppError("Job Not Found", 404));
  }

  if (job.createdBy._id.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only update your own jobs", 409));
  }

  const allowedFields = [
    "title",
    "description",
    "company",
    "location",
    "salary",
    "jobType",
    "experienceLevel",
    "skills",
    "isActive",
  ];

  const updates = {};

  // only allowed field can change
  allowedFields.forEach((field)=>{
    if(req.body[field] !== undefined){
      updates[field] = req.body[field];
    }
  });

  console.log('updates',updates)
  // 
  const updatedJob = await jobModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    job: updatedJob,
  });
});

export const deleteJob = catchAsync(async (req, res,next) => {
  const { id } = req.params;

  const job = await jobModel.findById(id);

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  // Check ownership
  if (job.createdBy.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only delete your own jobs", 403));
  }

  const application = await ApplicationModel.findOne({job : id})
  console.log("application id : " ,application)

  await ApplicationModel.findByIdAndDelete(application._id)
  await jobModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

export const saveJob = catchAsync(async (req, res,next) => {
  const { id } = req.params;

  //  check job Exist
  const job = await jobModel.findOne({
    _id: id,
    isActive: true,
  });

  if (!job) {
    return next(new AppError("Job Not Found", 404));
  }

  // if already exist
  const isJobExist = await SavedJobModel.findOne({
    user: req.user._id,
    job: id,
  });

  if (isJobExist) {
    return new AppError('"Job is already saved', 409);
  }

  const savedJob = await SavedJobModel.create({
    user: req.user._id,
    job: id,
  });

  res.status(201).json({
    success: true,
    message: "Job saved successfully",
    savedJob,
  });
});

export const getSavedJob = catchAsync(async (req, res) => {
  const savedJobs = await SavedJobModel.find({
    user: req.user._id,
  })
    .populate({
      path: "job",
      populate: {
        path: "createdBy",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: savedJobs.length,
    savedJobs,
  });
});

export const removeSavedJob = catchAsync(async (req, res) => {
  const { id } = req.params;
  const savedJob = await SavedJobModel.findOneAndDelete({
    user: req.user._id,
    job: id,
  });

  if (!savedJob) {
    return next(new AppError("Saved job not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Job removed from saved jobs",
  });
});
