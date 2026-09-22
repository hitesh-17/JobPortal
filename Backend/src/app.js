import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.route.js";
import jobrouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";
import userRouter from "./routes/user.route.js";
import errorHandler from "./middleware/error.middleware.js";
import AppError from "./utils/AppError.js";
import adminRouter from "./routes/admin.route.js";
import recruiterRouter from "./routes/recruiter.route.js";

const app = express();

app.use(cors({origin: process.env.CLIENT_URL,credentials: true}));
// Middleware
app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);
app.set("query parser", "extended");

app.use(cookieParser());


app.get("/", (req, res) => res.send("Server is up and running"));

app.use("/v1/auth", authrouter);
app.use("/v1/job", jobrouter);
app.use("/v1/application", applicationRouter);
app.use("/v1/user", userRouter);

app.use("/v1/admin", adminRouter);
app.use("/v1/recruiter", recruiterRouter);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export default app;
