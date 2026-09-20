import express from "express";

import {
  createApplication,
  getApplicationById,
  listApplications,
} from "../controllers/applicationController.js";

import { requireAuth } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(requireAuth);

router
  .route("/")
  .get(
    asyncHandler(listApplications),
  )
  .post(
    asyncHandler(createApplication),
  );

router.get(
  "/:id",
  asyncHandler(getApplicationById),
);

export default router;