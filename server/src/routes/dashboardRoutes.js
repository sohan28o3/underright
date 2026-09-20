import express from "express";

import {
  getDashboard,
} from "../controllers/dashboardController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

import {
  asyncHandler,
} from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(getDashboard),
);

export default router;