import { z } from "zod";

export const createChatHistorySchema = z.object({
  body: z.object({
    userMessage: z.string().trim().min(1).max(5000),
    aiResponse: z.string().trim().min(1).max(5000),
    // Not part of the requested body shape, but your schema's ChatHistory.chatType
    // has no @default, so it's accepted here as optional and defaulted server-side
    // in the service (see chatHistory.service.ts / INTEGRATION_NOTES.md).
    chatType: z.enum(["RECOMMENDATION", "PET_CARE", "ADOPTION_ASSISTANT"]).optional(),
  }),
});

export const chatHistoryIdParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export type CreateChatHistorySchema = z.infer<typeof createChatHistorySchema>;
export type ChatHistoryIdParamsSchema = z.infer<typeof chatHistoryIdParamsSchema>;
