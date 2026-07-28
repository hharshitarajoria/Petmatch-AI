import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import * as conversationController from "../controllers/conversation.controller";
import { conversationIdParamsSchema } from "../validators/conversation.validator";

const router = Router();

router.use(authenticate);

router.get("/", conversationController.getMyConversations);

router.get(
  "/:id",
  validate(conversationIdParamsSchema),
  conversationController.getConversationById
);

export default router;
