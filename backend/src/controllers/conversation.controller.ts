import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError } from "../utils/httpError";
import * as conversationService from "../services/conversation.service";

export const getMyConversations = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const conversations = await conversationService.getMyConversations(req.user.id);

  res.status(200).json({
    success: true,
    data: conversations,
  });
});

export const getConversationById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const conversation = await conversationService.getConversationById(req.user.id, req.params.id as string);

  res.status(200).json({
    success: true,
    data: conversation,
  });
});
