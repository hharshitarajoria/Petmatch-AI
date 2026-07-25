import { Breed, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ConflictError, NotFoundError } from '../utils/httpError';
import {
  CreateBreedInput,
  UpdateBreedInput,
  GetBreedsQuery,
} from '../validators/breed.validator';
import { PaginatedBreeds } from '../types/breed.types';

async function findBreedOrThrow(id: string): Promise<Breed> {
  const breed = await prisma.breed.findUnique({ where: { id } });
  if (!breed) {
    throw new NotFoundError('Breed not found');
  }
  return breed;
}

async function assertUniqueWithinSpecies(
  speciesId: string,
  name: string,
  excludeId?: string
): Promise<void> {
  const duplicate = await prisma.breed.findFirst({
    where: { speciesId, name, ...(excludeId && { id: { not: excludeId } }) },
  });
  if (duplicate) {
    throw new ConflictError('A breed with this name already exists for this species');
  }
}

export async function createBreed(input: CreateBreedInput): Promise<Breed> {
  await assertUniqueWithinSpecies(input.speciesId, input.name);

  return prisma.breed.create({
    data: {
      speciesId: input.speciesId,
      name: input.name,

      energyLevel: input.energyLevel,
      noiseLevel: input.noiseLevel,
      groomingLevel: input.groomingLevel,

      spaceRequirement: input.spaceRequirement,

      averageMonthlyCost: input.averageMonthlyCost,

      childFriendly: input.childFriendly,

      apartmentFriendly: input.apartmentFriendly,
    },
  });
}

export async function getAllBreeds(query: GetBreedsQuery): Promise<PaginatedBreeds> {
  const { page, limit, speciesId, search, sortBy, sortOrder } = query;

  const where: Prisma.BreedWhereInput = {
    ...(speciesId && { speciesId }),
    ...(search && {
      name: { contains: search, mode: 'insensitive' },
    }),
  };

  const [data, totalItems] = await Promise.all([
    prisma.breed.findMany({
      where,
      orderBy: { [sortBy]: sortOrder } as Prisma.BreedOrderByWithRelationInput,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.breed.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
  };
}

export async function getBreedById(id: string): Promise<Breed> {
  return findBreedOrThrow(id);
}

export async function updateBreed(id: string, input: UpdateBreedInput): Promise<Breed> {
  const existingBreed = await findBreedOrThrow(id);

  if (input.name || input.speciesId) {
    const targetSpeciesId = input.speciesId ?? existingBreed.speciesId;
    const targetName = input.name ?? existingBreed.name;
    await assertUniqueWithinSpecies(targetSpeciesId, targetName, id);
  }

  return prisma.breed.update({
    where: { id },
    data: input,
  });
}

export async function deleteBreed(id: string): Promise<void> {
  await findBreedOrThrow(id);
  await prisma.breed.delete({ where: { id } });
}
