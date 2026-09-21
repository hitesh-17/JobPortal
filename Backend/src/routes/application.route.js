import express from "express";
import { authorize } from "../middleware/role.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  applyForJob,
  getJobApplicants,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

/**
 * Get all Applications apply by jobseeker
 *  /application/my
 */
router.get("/my", protect, authorize("jobseeker"), getMyApplications);

/**
 * Apply for the Job by Job ID
 *  /application/65b.....Job_ID....
 */
router.post("/:jobId", protect, authorize("jobseeker"), applyForJob);

/**
 * Recruiter will check the JobApplication based on the JOBID
 * .application/job/654....JobId....
 */
router.get("/job/:jobId", protect, authorize("recruiter"), getJobApplicants);

/**
 * Recruiter will check the JobApplication and updateStatus
 * .application/job/654....JobId....
 */
router.patch("/:id/status", protect, authorize("recruiter"), updateApplicationStatus);



export default router;
