import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import sessionModel from "../models/session.model.js";
import hashToken from "../utils/hashToken.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookieOption.js";

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // 1. Validate required fields
  if (!name || !email || !password) {
    return next(new AppError("Name, email and password are required", 400));
  }

  // 2. Check if user already exists
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return next(new AppError("User already exists", 409));
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. Create user
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role: role || "jobseeker",
  });

  // 5. Send response
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      // id: user._id,
      name: user.name,
      email: user.email,
      // role: user.role,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // 2. Find user
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 3. Compare password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 401));
  }

  const sessionId = new mongoose.Types.ObjectId();
  console.log(sessionId);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id, sessionId);

  const refreshTokenHash = hashToken(refreshToken);

  await sessionModel.create({
    _id: sessionId,
    user: user._id,
    refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("accessToken", accessToken, accessCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      name: user.name,
      email: user.email,
      role : user.role,
      resume: user.resume,
      profile : user.proflie
    },
  });

  // 4. Generate JWT
  // access Token
  // Refresh Token

  // const token = jwt.sign(
  //   { id: user._id, email: email },
  //   process.env.JWT_SECRET,
  // );

  // 5. Store JWT in HTTP-only cookie
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //   // maxAge: 10000,
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  // 6. Send response
  // res.status(200).json({
  //   success: true,
  //   message: "Login successful",
  //   user: {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     role: user.role,
  //   },
  // });
});

export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const refreshAccessToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("Refresh token missing", 401));
  }
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return next(new AppError("Invalid or expired refresh token", 401));
  }

  const session = await sessionModel.findById(decoded.sessionId);

  if (!session) {
    return next(new AppError("Session not found", 401));
  }

  if (session.revokedAt) {
    return next(new AppError("Refresh token has been revoked", 401));
  }

  if (session.expiresAt < new Date()) {
    return next(new AppError("Refresh token has expired", 401));
  }

  const tokenHash = hashToken(refreshToken);

  if (tokenHash !== session.refreshTokenHash) {
    return next(new AppError("Invalid refresh token", 401));
  }

  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  // Create new refresh token
  const newSessionId = new mongoose.Types.ObjectId();
  const newRefreshToken = generateRefreshToken(user._id, newSessionId);

  const newAccessToken = generateAccessToken(user._id);

  const newRefreshTokenHash = hashToken(newRefreshToken);

  // Revoke old session
  session.revokedAt = new Date();
  session.replacedByTokenHash = newRefreshTokenHash;

  await session.save();

  // Create new session
  await sessionModel.create({
    _id: newSessionId,
    user: user._id,
    refreshTokenHash: newRefreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("accessToken", newAccessToken, accessCookieOptions);

  res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Access token refreshed",
  });
});

export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      await Session.findByIdAndUpdate(decoded.sessionId, {
        revokedAt: new Date(),
      });
    } catch (error) {
      // Token is already invalid/expired.
      // Still clear cookies.
    }
  }

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
