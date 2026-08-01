import { Pet, Prisma, UserRole, Gender, PetStatus, ActivityLevel, SpaceRequirement } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ForbiddenError, NotFoundError } from '../utils/httpError';
import { RequestingUser, PaginatedPets } from '../types/pet.types';

export interface CreatePetInput {
  speciesId: string;
  breedId: string;
  name: string;
  age: number;
  gender: Gender;
  description?: string;
  monthlyCost?: number;
  vaccinated: boolean;
  sterilized: boolean;
  status?: PetStatus;
  energyLevelOverride?: ActivityLevel;
  noiseLevelOverride?: ActivityLevel;
  groomingLevelOverride?: ActivityLevel;
  spaceRequirementOverride?: SpaceRequirement;
  apartmentFriendlyOverride?: boolean;
  childFriendlyOverride?: boolean;
  monthlyCostOverride?: number;
}

export type UpdatePetInput = Partial<CreatePetInput>;

export interface GetPetsQuery {
  page: number;
  limit: number;
  speciesId?: string;
  breedId?: string;
  gender?: Gender;
  status?: PetStatus;
  vaccinated?: boolean;
  sterilized?: boolean;
  minAge?: number;
  maxAge?: number;
  search?: string;
  sortBy: 'createdAt' | 'age' | 'name';
  sortOrder: 'asc' | 'desc';
}

function assertOwnerOrAdmin(pet: Pet, requester: RequestingUser): void {
  const isOwner = pet.ownerId === requester.id;
  const isAdmin = requester.role === UserRole.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenError('You do not have permission to modify this pet');
  }
}

async function findPetOrThrow(id: string): Promise<Pet> {
  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet) {
    throw new NotFoundError('Pet not found');
  }
  return pet;
}

export async function createPet(input: CreatePetInput, ownerId: string): Promise<Pet> {
  return prisma.pet.create({
    data: {
      ownerId,
      speciesId: input.speciesId,
      breedId: input.breedId,
      name: input.name,
      age: input.age,
      gender: input.gender,
      description: input.description,
      monthlyCost: input.monthlyCost,
      vaccinated: input.vaccinated,
      sterilized: input.sterilized,
      status: input.status,
      energyLevelOverride: input.energyLevelOverride,
      noiseLevelOverride: input.noiseLevelOverride,
      groomingLevelOverride: input.groomingLevelOverride,
      spaceRequirementOverride: input.spaceRequirementOverride,
      apartmentFriendlyOverride: input.apartmentFriendlyOverride,
      childFriendlyOverride: input.childFriendlyOverride,
      monthlyCostOverride: input.monthlyCostOverride,
    },
  });
}

export async function getAllPets(query: GetPetsQuery): Promise<PaginatedPets> {
  const {
    page,
    limit,
    speciesId,
    breedId,
    gender,
    status,
    vaccinated,
    sterilized,
    minAge,
    maxAge,
    search,
    sortBy,
    sortOrder,
  } = query;

  const where: Prisma.PetWhereInput = {
    ...(speciesId && { speciesId }),
    ...(breedId && { breedId }),
    ...(gender && { gender }),
    ...(status && { status }),
    ...(vaccinated !== undefined && { vaccinated }),
    ...(sterilized !== undefined && { sterilized }),
    ...((minAge !== undefined || maxAge !== undefined) && {
      age: {
        ...(minAge !== undefined && { gte: minAge }),
        ...(maxAge !== undefined && { lte: maxAge }),
      },
    }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [data, totalItems] = await Promise.all([
    prisma.pet.findMany({
  where,
  include: {
    species: true,
    breed: true,
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        city: true,
      },
    },
    images: {
      select: {
        id: true,
        imageUrl: true,
      },
    },
  },
  orderBy: {
    [sortBy]: sortOrder,
  } as Prisma.PetOrderByWithRelationInput,
  skip: (page - 1) * limit,
  take: limit,
}),
prisma.pet.count({ where }),
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

export async function getPetById(id: string) {
  const pet = await prisma.pet.findUnique({
    where: { id },
    include: {
      species: true,
      breed: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          city: true,
        },
      },
      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!pet) {
    throw new NotFoundError("Pet not found");
  }

  return pet;
}

export async function updatePet(
  id: string,
  input: UpdatePetInput,
  requester: RequestingUser
): Promise<Pet> {
  const existingPet = await findPetOrThrow(id);
  assertOwnerOrAdmin(existingPet, requester);

  return prisma.pet.update({
    where: { id },
    data: input,
  });
}

export async function deletePet(id: string, requester: RequestingUser): Promise<void> {
  const existingPet = await findPetOrThrow(id);
  assertOwnerOrAdmin(existingPet, requester);

  await prisma.pet.delete({ where: { id } });
}