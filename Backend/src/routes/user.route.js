import express from 'express';
import uploadResume from '../controllers/upload.controller.js';
import upload from '../middleware/upload.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

/**
 * upload resume 
 *  patch /user/resume
 */
router.patch("/resume",protect,upload.single('resume'),uploadResume);

export default router;