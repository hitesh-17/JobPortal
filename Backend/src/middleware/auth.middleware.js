import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(new AppError("You are not authrized, Please do valid login to access this resource", 401));
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    // Find user
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return next(
        new AppError("User associated with this token no longer exists", 401),
      );
    }

    console.log(token,decoded,user)
    req.user = user;

    next();
})
