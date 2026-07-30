import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireUser } from "../utils/requireUser";
import * as chatHistoryService from "../services/chatHistory.service";

export const createChatHistory = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const chat = await chatHistoryService.createChatHistory(user.id, req.body);

  return res.status(201).json({
    success: true,
    message: "Chat history saved successfully",
    data: chat,
  });
});

export const getMyChatHistory = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const history = await chatHistoryService.getMyChatHistory(user.id);

  return res.status(200).json({
    success: true,
    message: "Chat history fetched successfully",
    data: history,
  });
});

export const getChatHistoryById = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const chat = await chatHistoryService.getChatHistoryById(user.id, req.params.id as string);

  return res.status(200).json({
    success: true,
    message: "Chat history entry fetched successfully",
    data: chat,
  });
});

export const deleteChatHistoryById = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const result = await chatHistoryService.deleteChatHistoryById(user.id, req.params.id as string);

  return res.status(200).json({
    success: true,
    message: "Chat history entry deleted successfully",
    data: result,
  });
});

export const deleteAllChatHistory = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const result = await chatHistoryService.deleteAllChatHistory(user.id);

  return res.status(200).json({
    success: true,
    message: "All chat history deleted successfully",
    data: result,
  });
});
