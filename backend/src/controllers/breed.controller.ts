import { Request, Response } from 'express';
import { Breed } from '@prisma/client';
import {
  createBreed as createBreedService,
  getAllBreeds as getAllBreedsService,
  getBreedById as getBreedByIdService,
  updateBreed as updateBreedService,
  deleteBreed as deleteBreedService,
} from '../services/breed.service';
import {
  CreateBreedInput,
  UpdateBreedInput,
  BreedIdParams,
  GetBreedsQuery,
} from '../validators/breed.validator';
import { ApiSuccessResponse } from '../types';
import { PaginatedBreeds } from '../types/breed.types';

export async function createBreed(
  req: Request,
  res: Response<ApiSuccessResponse<Breed>>
): Promise<void> {
  const input = req.body as CreateBreedInput;

  const breed = await createBreedService(input);

  res.status(201).json({
    success: true,
    message: 'Breed created successfully',
    data: breed,
  });
}

export async function getAllBreeds(
  req: Request,
  res: Response<ApiSuccessResponse<PaginatedBreeds>>
): Promise<void> {
  const query = req.query as unknown as GetBreedsQuery;

  const result = await getAllBreedsService(query);

  res.status(200).json({
    success: true,
    message: 'Breeds retrieved successfully',
    data: result,
  });
}

export async function getBreedById(
  req: Request,
  res: Response<ApiSuccessResponse<Breed>>
): Promise<void> {
  const { id } = req.params as BreedIdParams;

  const breed = await getBreedByIdService(id);

  res.status(200).json({
    success: true,
    message: 'Breed retrieved successfully',
    data: breed,
  });
}

export async function updateBreed(
  req: Request,
  res: Response<ApiSuccessResponse<Breed>>
): Promise<void> {
  const { id } = req.params as BreedIdParams;
  const input = req.body as UpdateBreedInput;

  const breed = await updateBreedService(id, input);

  res.status(200).json({
    success: true,
    message: 'Breed updated successfully',
    data: breed,
  });
}

export async function deleteBreed(
  req: Request,
  res: Response<ApiSuccessResponse<null>>
): Promise<void> {
  const { id } = req.params as BreedIdParams;

  await deleteBreedService(id);

  res.status(200).json({
    success: true,
    message: 'Breed deleted successfully',
    data: null,
  });
}
