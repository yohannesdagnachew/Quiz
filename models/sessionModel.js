// models/sessionModel.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Session", sessionSchema);
