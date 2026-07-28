import { prisma } from '../config/prisma';
import { NotFoundError, ForbiddenError } from "../utils/httpError";

/**
 * Ensures the given conversation exists and the user is one of its
 * two participants (owner or adopter). Returns the conversation if so.
 */
const assertParticipant = async (userId: string, conversationId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  if (conversation.ownerId !== userId && conversation.adopterId !== userId) {
    throw new ForbiddenError("You are not a participant in this conversation");
  }

  return conversation;
};

/**
 * Fetch a single conversation's details.
 * Only the owner or adopter participant may access it.
 */
export const getConversationById = async (userId: string, conversationId: string) => {
  await assertParticipant(userId, conversationId);

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      pet: true,
      owner: { select: { id: true, name: true, profilePicture: true } },
      adopter: { select: { id: true, name: true, profilePicture: true } },
      adoptionRequest: true,
    },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  return conversation;
};

/**
 * Fetch every conversation the current user participates in
 * (either as pet owner or as adopter), most recent first,
 * including the pet, the other participant, and the latest message.
 */
export const getMyConversations = async (userId: string) => {
  return prisma.conversation.findMany({
    where: {
      OR: [{ ownerId: userId }, { adopterId: userId }],
    },
    include: {
      pet: true,
      owner: { select: { id: true, name: true, profilePicture: true } },
      adopter: { select: { id: true, name: true, profilePicture: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
