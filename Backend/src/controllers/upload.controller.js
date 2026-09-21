import cloudinary from "../config/cloudinary.js";
import ApplicationModel from "../models/application.model.js";
import UserModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("Please upload a PDF resume", 400));
      // res.status(400).json({
      //   success: false,
      //   message: "Please upload a PDF resume",
      // });
    }
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "resumes",
          resource_type: "raw",
          public_id: `${Date.now()}-${req.file.originalname}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        resume: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      },
      {
        new: true,
      },
    );
    const applicationUser = await ApplicationModel.findByIdAndUpdate(
      req.user._id,
      {
        resume: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      },
      {
        new: true,
      },
    );

    // console.log(req.user);
    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

export default uploadResume;
