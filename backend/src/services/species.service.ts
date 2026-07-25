import { Species, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ConflictError, NotFoundError } from '../utils/httpError';
import {
  CreateSpeciesInput,
  UpdateSpeciesInput,
  GetSpeciesQuery,
} from '../validators/species.validator';
import { PaginatedSpecies } from '../types/species.types';

async function findSpeciesOrThrow(id: string): Promise<Species> {
  const species = await prisma.species.findUnique({ where: { id } });
  if (!species) {
    throw new NotFoundError('Species not found');
  }
  return species;
}

export async function createSpecies(input: CreateSpeciesInput): Promise<Species> {
  const existing = await prisma.species.findUnique({ where: { name: input.name } });
  if (existing) {
    throw new ConflictError('A species with this name already exists');
  }

  return prisma.species.create({
    data: {
      name: input.name,
      description: input.description,
    },
  });
}

export async function getAllSpecies(query: GetSpeciesQuery): Promise<PaginatedSpecies> {
  const { page, limit, search, sortBy, sortOrder } = query;

  const where: Prisma.SpeciesWhereInput = {
    ...(search && {
      name: { contains: search, mode: 'insensitive' },
    }),
  };

  const [data, totalItems] = await Promise.all([
    prisma.species.findMany({
      where,
      orderBy: { [sortBy]: sortOrder } as Prisma.SpeciesOrderByWithRelationInput,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.species.count({ where }),
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

export async function getSpeciesById(id: string): Promise<Species> {
  return findSpeciesOrThrow(id);
}

export async function updateSpecies(id: string, input: UpdateSpeciesInput): Promise<Species> {
  await findSpeciesOrThrow(id);

  if (input.name) {
    const duplicate = await prisma.species.findUnique({ where: { name: input.name } });
    if (duplicate && duplicate.id !== id) {
      throw new ConflictError('A species with this name already exists');
    }
  }

  return prisma.species.update({
    where: { id },
    data: input,
  });
}

export async function deleteSpecies(id: string): Promise<void> {
  await findSpeciesOrThrow(id);
  await prisma.species.delete({ where: { id } });
}
