import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { deleteJobAdmin, deleteUser, getAllApplications, getAllJobsAdmin, getAllUsers, getDashboardStats, getUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect, authorize("admin"));

/**
 *     Admin
 */
// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.delete("/users/:id", deleteUser);

// Jobs
router.get("/jobs", getAllJobsAdmin);
router.delete("/jobs/:id", deleteJobAdmin);

// Applications
router.get("/applications", getAllApplications);

export default router;