import { SavedPet } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ConflictError, NotFoundError } from '../utils/httpError';
import { SavedPetWithDetails } from '../types/savedPet.types';

async function assertPetExists(petId: string): Promise<void> {
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new NotFoundError('Pet not found');
  }
}

export async function saveMyPet(userId: string, petId: string): Promise<SavedPet> {
  await assertPetExists(petId);

  const existing = await prisma.savedPet.findUnique({
    where: { userId_petId: { userId, petId } },
  });
  if (existing) {
    throw new ConflictError('Pet is already saved');
  }

  return prisma.savedPet.create({
    data: { userId, petId },
  });
}

export async function removeMySavedPet(userId: string, petId: string): Promise<void> {
  const existing = await prisma.savedPet.findUnique({
    where: { userId_petId: { userId, petId } },
  });
  if (!existing) {
    throw new NotFoundError('Saved pet not found');
  }

  await prisma.savedPet.delete({
    where: { userId_petId: { userId, petId } },
  });
}

export async function getMySavedPets(userId: string): Promise<SavedPetWithDetails[]> {
  return prisma.savedPet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      pet: {
        include: {
          breed: true,
          species: true,
          images: { select: { id: true, imageUrl: true } },
          owner: { select: { id: true, name: true, email: true, phoneNumber: true, city: true } },
        },
      },
    },
  });
}
