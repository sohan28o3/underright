import express from "express";

import {
  createApplication,
  getApplicationById,
  listApplications,
} from "../controllers/applicationController.js";

import {
  generateExplanation,
} from "../controllers/explanationController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

import {
  asyncHandler,
} from "../utils/asyncHandler.js";

const router =
  express.Router();

router.use(requireAuth);

router
  .route("/")
  .get(
    asyncHandler(
      listApplications,
    ),
  )
  .post(
    asyncHandler(
      createApplication,
    ),
  );

router.post(
  "/:id/explanation",
  asyncHandler(
    generateExplanation,
  ),
);

router.get(
  "/:id",
  asyncHandler(
    getApplicationById,
  ),
);

export default router;