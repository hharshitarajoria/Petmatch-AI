import { z } from "zod";

export const createNotificationSchema = z.object({
  body: z.object({
    userId: z.uuid(),
    title: z.string().trim().min(1).max(150),
    message: z.string().trim().min(1).max(1000),
  }),
});

export const notificationIdParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export const listNotificationsQuerySchema = z.object({
  query: z.object({
    isRead: z.enum(["true", "false"]).optional(),
    take: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
export type NotificationIdParamsSchema = z.infer<typeof notificationIdParamsSchema>;
export type ListNotificationsQuerySchema = z.infer<typeof listNotificationsQuerySchema>;
