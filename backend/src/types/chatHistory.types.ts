import { ChatType } from "@prisma/client";

export interface CreateChatHistoryInput {
  userMessage: string;
  aiResponse: string;
  chatType?: ChatType;
}

export interface ChatHistoryIdParams {
  id: string;
}
