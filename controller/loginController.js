import crypto from "crypto";
import Session from "../models/sessionModel.js";



export const login = async (req, res, next) => {
  try {
    // Generate a random 32-byte session token
    const token = crypto.randomBytes(32).toString("hex");

    // Create session in DB
    await Session.create({
      token,
      ipAddress: req.ip,
    });

    // Return token to client
    return res.json({
      message: "Login successful",
      token: token,
    });

  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};