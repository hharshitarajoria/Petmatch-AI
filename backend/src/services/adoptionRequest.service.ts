import {
  AdoptionRequestStatus,
  PetStatus,
  UserRole,
  Prisma,
} from "@prisma/client";
import { prisma } from '../config/prisma';
import { NotFoundError, ForbiddenError, ConflictError } from "../utils/httpError";
import { CreateAdoptionRequestInput } from "../types/adoptionRequest.types";

/**
 * Create a new adoption request.
 * - A user cannot request adoption of their own pet.
 * - A pet must be AVAILABLE to be requested.
 * - A user cannot have more than one PENDING request for the same pet.
 */
export const createAdoptionRequest = async (
  requesterId: string,
  input: CreateAdoptionRequestInput
) => {
  const pet = await prisma.pet.findUnique({ where: { id: input.petId } });

  if (!pet) {
    throw new NotFoundError("Pet not found");
  }

  if (pet.ownerId === requesterId) {
    throw new ForbiddenError("You cannot request adoption for your own pet");
  }

  if (pet.status !== PetStatus.AVAILABLE) {
    throw new ConflictError("This pet is not currently available for adoption");
  }

  const existingPendingRequest = await prisma.adoptionRequest.findFirst({
    where: {
      petId: input.petId,
      requesterId,
      status: AdoptionRequestStatus.PENDING,
    },
  });

  if (existingPendingRequest) {
    throw new ConflictError("You already have a pending adoption request for this pet");
  }

  return prisma.adoptionRequest.create({
    data: {
      petId: input.petId,
      requesterId,
      message: input.message ?? null,
    },
    include: {
      pet: true,
    },
  });
};

/**
 * Fetch a single adoption request.
 * Only the requester, the pet owner, or an ADMIN may view it.
 */
export const getAdoptionRequestById = async (
  userId: string,
  role: UserRole,
  requestId: string
) => {
  const request = await prisma.adoptionRequest.findUnique({
    where: { id: requestId },
    include: { pet: true, requester: true },
  });

  if (!request) {
    throw new NotFoundError("Adoption request not found");
  }

  const isRequester = request.requesterId === userId;
  const isOwner = request.pet.ownerId === userId;

  if (!isRequester && !isOwner && role !== UserRole.ADMIN) {
    throw new ForbiddenError("You do not have access to this adoption request");
  }

  return request;
};

/** Requests made by the current user (as requester). */
export const getMyAdoptionRequests = async (requesterId: string) => {
  return prisma.adoptionRequest.findMany({
    where: { requesterId },
    include: { pet: true },
    orderBy: { createdAt: "desc" },
  });
};

/** Requests received on pets owned by the current user. */
export const getReceivedAdoptionRequests = async (ownerId: string) => {
  return prisma.adoptionRequest.findMany({
    where: { pet: { ownerId } },
    include: { pet: true, requester: true },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Accept an adoption request.
 * Only the pet's owner may accept it. On acceptance:
 * - the request is marked ACCEPTED
 * - all other PENDING requests for the same pet are auto-REJECTED
 * - the pet is moved to PENDING status (no longer publicly available)
 * - a Conversation is created for the accepted request (or reused if it
 *   already exists, since Conversation.adoptionRequestId is unique)
 * All of this happens inside a single transaction.
 */
export const acceptAdoptionRequest = async (ownerId: string, requestId: string) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const request = await tx.adoptionRequest.findUnique({
      where: { id: requestId },
      include: { pet: true },
    });

    if (!request) {
      throw new NotFoundError("Adoption request not found");
    }

    if (request.pet.ownerId !== ownerId) {
      throw new ForbiddenError("Only the pet owner can accept this request");
    }

    if (request.status !== AdoptionRequestStatus.PENDING) {
      throw new ConflictError("This request has already been processed");
    }

    const updatedRequest = await tx.adoptionRequest.update({
      where: { id: requestId },
      data: { status: AdoptionRequestStatus.ACCEPTED },
    });

    await tx.adoptionRequest.updateMany({
      where: {
        petId: request.petId,
        status: AdoptionRequestStatus.PENDING,
        NOT: { id: requestId },
      },
      data: { status: AdoptionRequestStatus.REJECTED },
    });

    await tx.pet.update({
      where: { id: request.petId },
      data: { status: PetStatus.PENDING },
    });

    let conversation = await tx.conversation.findUnique({
      where: { adoptionRequestId: requestId },
    });

    if (!conversation) {
      conversation = await tx.conversation.create({
        data: {
          petId: request.petId,
          ownerId,
          adopterId: request.requesterId,
          adoptionRequestId: requestId,
        },
      });
    }

    return { adoptionRequest: updatedRequest, conversation };
  });
};

/**
 * Reject an adoption request. Only the pet's owner may reject it.
 */
export const rejectAdoptionRequest = async (ownerId: string, requestId: string) => {
  const request = await prisma.adoptionRequest.findUnique({
    where: { id: requestId },
    include: { pet: true },
  });

  if (!request) {
    throw new NotFoundError("Adoption request not found");
  }

  if (request.pet.ownerId !== ownerId) {
    throw new ForbiddenError("Only the pet owner can reject this request");
  }

  if (request.status !== AdoptionRequestStatus.PENDING) {
    throw new ConflictError("This request has already been processed");
  }

  return prisma.adoptionRequest.update({
    where: { id: requestId },
    data: { status: AdoptionRequestStatus.REJECTED },
  });
};

/**
 * Cancel a pending adoption request. Only the original requester may cancel it.
 */
export const cancelAdoptionRequest = async (requesterId: string, requestId: string) => {
  const request = await prisma.adoptionRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new NotFoundError("Adoption request not found");
  }

  if (request.requesterId !== requesterId) {
    throw new ForbiddenError("You can only cancel your own adoption request");
  }

  if (request.status !== AdoptionRequestStatus.PENDING) {
    throw new ConflictError("Only pending requests can be cancelled");
  }

  return prisma.adoptionRequest.update({
    where: { id: requestId },
    data: { status: AdoptionRequestStatus.CANCELLED },
  });
};
