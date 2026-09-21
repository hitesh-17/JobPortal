import express from "express";
import { getRecentApplications, getRecruiterDashboard, getRecruiterJobs } from "../controllers/recruiter.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect, authorize("recruiter"));

router.get("/dashboard", getRecruiterDashboard);

router.get("/jobs", getRecruiterJobs);

router.get("/applications/recent", getRecentApplications);

export default router;