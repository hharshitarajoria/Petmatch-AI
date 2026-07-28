import { prisma } from '../config/prisma';
import { NotFoundError, ForbiddenError } from "../utils/httpError";
import { ListMessagesQuery } from "../types/message.types";

const SENDER_SELECT = { id: true, name: true, profilePicture: true } as const;

/**
 * Ensures the given conversation exists and the user is one of its
 * two participants (owner or adopter). Returns the conversation if so.
 */
const assertParticipant = async (userId: string, conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  if (conversation.ownerId !== userId && conversation.adopterId !== userId) {
    throw new ForbiddenError("You are not a participant in this conversation");
  }

  return conversation;
};

/**
 * Send a message in a conversation. Only participants may send messages.
 */
export const sendMessage = async (senderId: string, conversationId: string, message: string) => {
  await assertParticipant(senderId, conversationId);

  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      message,
    },
    include: {
      sender: { select: SENDER_SELECT },
    },
  });
};

/**
 * Fetch messages for a conversation, oldest first, including sender details.
 * Supports simple cursor-based pagination via `take` / `cursor`.
 */
export const getMessages = async (
  userId: string,
  conversationId: string,
  query: ListMessagesQuery
) => {
  await assertParticipant(userId, conversationId);

  return prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: { select: SENDER_SELECT },
    },
    orderBy: { createdAt: "asc" },
    take: query.take ?? 50,
    ...(query.cursor
      ? { cursor: { id: query.cursor }, skip: 1 }
      : {}),
  });
};

/**
 * Mark all messages in a conversation that were NOT sent by the current
 * user as read (i.e. mark the other participant's messages as read).
 */
export const markMessagesAsRead = async (userId: string, conversationId: string) => {
  await assertParticipant(userId, conversationId);

  return prisma.message.updateMany({
    where: {
      conversationId,
      isRead: false,
      NOT: { senderId: userId },
    },
    data: { isRead: true },
  });
};
