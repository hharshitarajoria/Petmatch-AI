import { z } from "zod";

export const conversationIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Conversation ID must be a valid UUID"),
  }),
});

export type ConversationIdParams = z.infer<
  typeof conversationIdParamsSchema
>["params"];