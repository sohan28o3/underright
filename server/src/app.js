import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS database_time",
    );

    return res.status(200).json({
      status: "ok",
      service: "UnderRight API",
      database: "connected",
      databaseTime:
        result.rows[0].database_time,
    });
  } catch (error) {
    console.error(
      "Health check database error:",
      error.message,
    );

    return res.status(503).json({
      status: "error",
      service: "UnderRight API",
      database: "unavailable",
    });
  }
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/applications",
  applicationRoutes,
);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;