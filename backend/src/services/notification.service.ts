import { prisma } from "../config/prisma";
import { NotFoundError, ForbiddenError } from "../utils/httpError";
import { CreateNotificationInput, ListNotificationsQuery } from "../types/notification.types";

/**
 * Create a notification for a specific user.
 * Intended for internal/admin use (e.g. system events, admin broadcasts) -
 * gated with authorize("ADMIN") at the route level.
 */
export const createNotification = async (input: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
    },
  });
};

/** Fetch the current user's notifications, optionally filtered by read status. */
export const getMyNotifications = async (userId: string, query: ListNotificationsQuery) => {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(query.isRead !== undefined ? { isRead: query.isRead === "true" } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: query.take ?? 50,
  });
};

/** Count of unread notifications for the current user (e.g. for a badge). */
export const getUnreadCount = async (userId: string) => {
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  });
  return { count };
};

/** Mark a single notification as read. Only the owner may do this. */
export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });

  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new ForbiddenError("You do not have access to this notification");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

/** Mark every unread notification belonging to the current user as read. */
export const markAllNotificationsAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

/** Delete a notification. Only the owner may do this. */
export const deleteNotification = async (userId: string, notificationId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });

  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new ForbiddenError("You do not have access to this notification");
  }

  await prisma.notification.delete({ where: { id: notificationId } });
  return { id: notificationId };
};
