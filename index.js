// index.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

// import quizRoutes from "./routes/quizRoutes.js";
import sessionRouter from "./Router/sessionRouter.js"
import transactionRouter from "./Router/transactionRouter.js"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


connectDB();

// Routes
app.use("/api", sessionRouter);
app.use("/api", transactionRouter)

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Quiz API is running ✅" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
