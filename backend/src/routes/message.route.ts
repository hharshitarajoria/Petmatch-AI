import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import * as messageController from "../controllers/message.controller";
import {
  conversationIdParamsSchema,
  sendMessageSchema,
  listMessagesQuerySchema,
} from "../validators/message.validator";

// Mount this router at the same base path as conversation.routes,
// e.g. app.use("/api/conversations", conversationRoutes);
//      app.use("/api/conversations", messageRoutes);
const router = Router();

router.use(authenticate);

router.post(
  "/:conversationId/messages",
  validate(conversationIdParamsSchema),
  validate(sendMessageSchema),
  messageController.sendMessage
);

router.get(
  "/:conversationId/messages",
  validate(conversationIdParamsSchema),
  validate(listMessagesQuerySchema),
  messageController.getMessages
);

router.patch(
  "/:conversationId/messages/read",
  validate(conversationIdParamsSchema),
  messageController.markMessagesAsRead
);

export default router;
