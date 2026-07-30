import { ChatType } from "@prisma/client";
import { prisma } from "../config/prisma";
import { NotFoundError, ForbiddenError } from "../utils/httpError";
import { CreateChatHistoryInput } from "../types/chatHistory.types";

/**
 * Save a chat exchange for the current user.
 * `chatType` is required by the schema (no @default) but wasn't part of the
 * requested request body, so it defaults to RECOMMENDATION when omitted.
 */
export const createChatHistory = async (userId: string, input: CreateChatHistoryInput) => {
  return prisma.chatHistory.create({
    data: {
      userId,
      chatType: input.chatType ?? ChatType.RECOMMENDATION,
      message: input.userMessage,
      response: input.aiResponse,
    },
  });
};

/** Fetch the current user's chat history, most recent first. */
export const getMyChatHistory = async (userId: string) => {
  return prisma.chatHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

/** Fetch a single chat history entry. Only the owner may view it. */
export const getChatHistoryById = async (userId: string, chatId: string) => {
  const chat = await prisma.chatHistory.findUnique({ where: { id: chatId } });

  if (!chat) {
    throw new NotFoundError("Chat history entry not found");
  }

  if (chat.userId !== userId) {
    throw new ForbiddenError("You do not have access to this chat history entry");
  }

  return chat;
};

/** Delete a single chat history entry. Only the owner may delete it. */
export const deleteChatHistoryById = async (userId: string, chatId: string) => {
  const chat = await prisma.chatHistory.findUnique({ where: { id: chatId } });

  if (!chat) {
    throw new NotFoundError("Chat history entry not found");
  }

  if (chat.userId !== userId) {
    throw new ForbiddenError("You do not have access to this chat history entry");
  }

  await prisma.chatHistory.delete({ where: { id: chatId } });
  return { id: chatId };
};

/** Delete every chat history entry belonging to the current user. */
export const deleteAllChatHistory = async (userId: string) => {
  return prisma.chatHistory.deleteMany({ where: { userId } });
};
