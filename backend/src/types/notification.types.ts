export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
}

export interface NotificationIdParams {
  id: string;
}

export interface ListNotificationsQuery {
  isRead?: "true" | "false";
  take?: number;
}
