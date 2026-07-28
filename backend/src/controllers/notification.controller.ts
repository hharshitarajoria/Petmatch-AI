import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireUser } from "../utils/requireUser";
import * as notificationService from "../services/notification.service";


export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  requireUser(req);

  const notification = await notificationService.createNotification(req.body);

  return res.status(201).json({
    success: true,
    message: "Notification created successfully",
    data: notification,
  });
});

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const notifications = await notificationService.getMyNotifications(
    user.id,
    req.query as { isRead?: "true" | "false"; take?: number }
  );

  return res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    data: notifications,
  });
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const result = await notificationService.getUnreadCount(user.id);

  return res.status(200).json({
    success: true,
    message: "Unread notification count fetched successfully",
    data: result,
  });
});

export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const notification = await notificationService.markNotificationAsRead(
    user.id,
    req.params.id as string
  );

  return res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

export const markAllNotificationsAsRead = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const result = await notificationService.markAllNotificationsAsRead(user.id);

  return res.status(200).json({
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const result = await notificationService.deleteNotification(user.id, req.params.id as string);

  return res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});
