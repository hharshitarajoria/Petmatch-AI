import { z } from "zod";

export const conversationIdParamsSchema = z.object({
  params: z.object({
    conversationId: z
      .string()
      .uuid("Conversation ID must be a valid UUID"),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    message: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(2000, "Message cannot exceed 2000 characters"),
  }),
});

export const listMessagesQuerySchema = z.object({
  query: z.object({
    take: z.coerce.number().int().min(1).max(100).optional(),
    cursor: z.string().uuid().optional(),
  }),
});

export type ConversationIdParams = z.infer<
  typeof conversationIdParamsSchema
>["params"];

export type SendMessageInput = z.infer<
  typeof sendMessageSchema
>["body"];

export type ListMessagesQuery = z.infer<
  typeof listMessagesQuerySchema
>["query"];