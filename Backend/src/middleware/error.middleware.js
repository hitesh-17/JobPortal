import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");

    error = new AppError(message, 400);
  }

  // Duplicate MongoDB value
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    error = new AppError(`${field} already exists`, 409);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError(
      "Invalid authentication token",
      401
    );
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError(
      "Authentication token has expired",
      401
    );
  }
  
  console.log(err);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message || "Something went wrong",
  });
};

export default errorHandler;
