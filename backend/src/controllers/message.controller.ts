import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError } from "../utils/httpError";
import * as messageService from "../services/message.service";

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const message = await messageService.sendMessage(
    req.user.id,
    req.params.conversationId as string,
    req.body.message
  );

  res.status(201).json({
    success: true,
    data: message,
    message: "Message sent successfully",
  });
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const messages = await messageService.getMessages(
    req.user.id,
    req.params.conversationId as string,
    req.query as { take?: number; cursor?: string }
  );

  res.status(200).json({
    success: true,
    data: messages,
  });
});

export const markMessagesAsRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const result = await messageService.markMessagesAsRead(req.user.id, req.params.conversationId as string);

  res.status(200).json({
    success: true,
    data: result,
    message: "Messages marked as read",
  });
});
