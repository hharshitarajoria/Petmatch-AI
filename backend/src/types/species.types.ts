import { Species } from '@prisma/client';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedSpecies {
  data: Species[];
  pagination: PaginationMeta;
}
