import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import * as notificationController from "../controllers/notification.controller";
import {
  createNotificationSchema,
  notificationIdParamsSchema,
  listNotificationsQuerySchema,
} from "../validators/notification.validator";

const router = Router();

router.use(authenticate);

// ADMIN-only: create a notification for a specific user
router.post(
  "/",
  authorize(UserRole.ADMIN),
  validate(createNotificationSchema),
  notificationController.createNotification
);

// Current user's notifications
router.get("/", validate(listNotificationsQuerySchema), notificationController.getMyNotifications);

router.get("/unread-count", notificationController.getUnreadCount);

router.patch(
  "/:id/read",
  validate(notificationIdParamsSchema),
  notificationController.markNotificationAsRead
);

router.patch("/read-all", notificationController.markAllNotificationsAsRead);

router.delete(
  "/:id",
  validate(notificationIdParamsSchema),
  notificationController.deleteNotification
);

export default router;
