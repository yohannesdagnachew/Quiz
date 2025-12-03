// models/transactionModel.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    // Link to the Session (required)
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    // Amount of the transaction
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // quiz | horoscope | lookup | bonus | etc.
    type: {
      type: String,
      required: true,
      enum: ["quiz", "horoscope", "lookup", "bonus"],
    },

    // pending | success | failed
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "success", "failed"],
    },

    // any metadata or provider info
    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

export default mongoose.model("Transaction", TransactionSchema);
