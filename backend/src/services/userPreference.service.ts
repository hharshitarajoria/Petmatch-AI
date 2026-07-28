import { UserPreference } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ConflictError, NotFoundError } from '../utils/httpError';
import {
  CreateUserPreferenceInput,
  UpdateUserPreferenceInput,
} from '../validators/userPreference.validator';

export async function createUserPreference(
  userId: string,
  input: CreateUserPreferenceInput
): Promise<UserPreference> {
  const existing = await prisma.userPreference.findUnique({ where: { userId } });
  if (existing) {
    throw new ConflictError('A preference already exists for this user');
  }

  return prisma.userPreference.create({
    data: {
      userId,
      homeType: input.homeType,
      activityLevel: input.activityLevel,
      monthlyBudget: input.monthlyBudget,
      workingHours: input.workingHours,
      hasChildren: input.hasChildren,
      hasOtherPets: input.hasOtherPets,
      petExperience: input.petExperience,
      preferredSpecies: input.preferredSpecies,
      preferredPetSize: input.preferredPetSize,
    },
  });
}

export async function getMyUserPreference(userId: string): Promise<UserPreference> {
  const preference = await prisma.userPreference.findUnique({ where: { userId } });
  if (!preference) {
    throw new NotFoundError('Preference not found for this user');
  }
  return preference;
}

export async function updateMyUserPreference(
  userId: string,
  input: UpdateUserPreferenceInput
): Promise<UserPreference> {
  const existing = await prisma.userPreference.findUnique({ where: { userId } });
  if (!existing) {
    throw new NotFoundError('Preference not found for this user');
  }

  return prisma.userPreference.update({
    where: { userId },
    data: input,
  });
}
