import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import * as reportController from "../controllers/report.controller";
import {
  createReportSchema,
  reportIdParamsSchema,
  updateReportStatusSchema,
  listReportsQuerySchema,
} from "../validators/report.validator";

const router = Router();

router.use(authenticate);

router.post("/", validate(createReportSchema), reportController.createReport);

router.get("/my", reportController.getMyReports);

// ADMIN-only: view every report, optionally filtered by ?status=
router.get(
  "/",
  authorize(UserRole.ADMIN),
  validate(listReportsQuerySchema),
  reportController.getAllReports
);

router.get("/:id", validate(reportIdParamsSchema), reportController.getReportById);

// ADMIN-only: transition a report's status
router.patch(
  "/:id/status",
  authorize(UserRole.ADMIN),
  validate(updateReportStatusSchema),
  reportController.updateReportStatus
);

export default router;
