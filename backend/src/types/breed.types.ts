import { Breed } from '@prisma/client';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedBreeds {
  data: Breed[];
  pagination: PaginationMeta;
}
