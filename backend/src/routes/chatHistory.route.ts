import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import * as chatHistoryController from "../controllers/chatHistory.controller";
import {
  createChatHistorySchema,
  chatHistoryIdParamsSchema,
} from "../validators/chatHistory.validator";

const router = Router();

router.use(authenticate);

router.post("/", validate(createChatHistorySchema), chatHistoryController.createChatHistory);

router.get("/", chatHistoryController.getMyChatHistory);

router.get("/:id", validate(chatHistoryIdParamsSchema), chatHistoryController.getChatHistoryById);

router.delete(
  "/:id",
  validate(chatHistoryIdParamsSchema),
  chatHistoryController.deleteChatHistoryById
);

router.delete("/", chatHistoryController.deleteAllChatHistory);

export default router;
