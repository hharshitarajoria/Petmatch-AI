export interface ConversationIdParams {
  conversationId: string;
}

export interface SendMessageInput {
  message: string;
}

export interface ListMessagesQuery {
  take?: number;
  cursor?: string;
}
