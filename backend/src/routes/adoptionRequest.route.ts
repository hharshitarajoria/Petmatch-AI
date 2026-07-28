import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import * as adoptionRequestController from "../controllers/adoptionRequest.controller";
import {
  createAdoptionRequestSchema,
  adoptionRequestIdParamsSchema,
} from "../validators/adoptionRequest.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createAdoptionRequestSchema),
  adoptionRequestController.createAdoptionRequest
);

router.get("/my", adoptionRequestController.getMyAdoptionRequests);

router.get("/received", adoptionRequestController.getReceivedAdoptionRequests);

router.get(
  "/:id",
  validate(adoptionRequestIdParamsSchema),
  adoptionRequestController.getAdoptionRequestById
);

router.patch(
  "/:id/accept",
  validate(adoptionRequestIdParamsSchema),
  adoptionRequestController.acceptAdoptionRequest
);

router.patch(
  "/:id/reject",
  validate(adoptionRequestIdParamsSchema),
  adoptionRequestController.rejectAdoptionRequest
);

router.patch(
  "/:id/cancel",
  validate(adoptionRequestIdParamsSchema),
  adoptionRequestController.cancelAdoptionRequest
);

export default router;
