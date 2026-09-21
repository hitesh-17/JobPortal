import express from "express";
import {protect} from '../middleware/auth.middleware.js';
import {authorize} from '../middleware/role.middleware.js';
import { createJob, getAllJob , getJob,updateJob ,deleteJob, saveJob, getSavedJob, removeSavedJob, getMyJobs } from "../controllers/job.controller.js";

const router = express.Router();
// For ALL
/**
 * getAllJob route
 * Get /job/
 * can search,pagging,filter,sort
*/
router.get('/',getAllJob);

/**
 * get savedJob by user route
 * post /job/save/68...jobID....
*/
router.get('/save',protect,authorize('jobseeker'),getSavedJob);

/**
 * getjob by recruiter route
 * get /job/
*/
router.get('/my',protect,authorize('recruiter'),getMyJobs);

/**
 * getJob route
 * get /job/68...jobID....
*/
router.get('/:id',getJob);

// Recruiter

/**
 * createJob route
 * Post /job/
*/
router.post('/',protect,authorize('recruiter'),createJob);

/**
 * update route
 * patch /job/68...jobID....
*/
router.patch('/:id',protect,authorize('recruiter'),updateJob);

/**
 * delete route
 * delete /job/68...jobID....
*/
router.delete('/:id',protect,authorize('recruiter'),deleteJob);


/**
 * saveJob(like bookmark or in array/obj) route
 * post /job/68...jobID..../save
*/
router.post('/:id/save',protect,authorize('jobseeker'),saveJob);


/**
 * deleting saveJob(like bookmark or in array/obj) route
 * delete /job/68...jobID..../save
*/
router.delete('/:id/save',protect,authorize('jobseeker'),removeSavedJob);

export default router;