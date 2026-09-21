import express from "express";
import {register, login, getMe, logout, refreshAccessToken} from "../controllers/auth.controller.js";
import {protect} from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * register route
 * Post /auth/register
*/
router.post('/register',register);
/**
 * login route
 * Post /auth/login
*/
router.post('/login',login);
/**
 *  logout
 * Post /auth/me
*/
router.post('/logout',protect,logout);
/**
 * get route
 * get /auth/me
*/
router.get('/me',protect,getMe);

/**
 * post refresh route
 * post /auth/me
*/
router.post('/refresh',refreshAccessToken);

export default router;