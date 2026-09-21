import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can save a particular job only once
savedJobSchema.index(
  {
    user: 1,
    job: 1,
  },
  {
    unique: true,
  }
);

const SavedJobModel = mongoose.model("SavedJob", savedJobSchema);

export default SavedJobModel;