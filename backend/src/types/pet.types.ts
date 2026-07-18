import { Pet, UserRole } from '@prisma/client';

export interface RequestingUser {
  id: string;
  role: UserRole;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedPets {
  data: Pet[];
  pagination: PaginationMeta;
}

export type PublicPet = Pet;
