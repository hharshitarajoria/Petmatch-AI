import { Request, Response } from 'express';
import { Species } from '@prisma/client';
import {
  createSpecies as createSpeciesService,
  getAllSpecies as getAllSpeciesService,
  getSpeciesById as getSpeciesByIdService,
  updateSpecies as updateSpeciesService,
  deleteSpecies as deleteSpeciesService,
} from '../services/species.service';
import {
  CreateSpeciesInput,
  UpdateSpeciesInput,
  SpeciesIdParams,
  GetSpeciesQuery,
} from '../validators/species.validator';
import { ApiSuccessResponse } from '../types';
import { PaginatedSpecies } from '../types/species.types';

export async function createSpecies(
  req: Request,
  res: Response<ApiSuccessResponse<Species>>
): Promise<void> {
  const input = req.body as CreateSpeciesInput;

  const species = await createSpeciesService(input);

  res.status(201).json({
    success: true,
    message: 'Species created successfully',
    data: species,
  });
}

export async function getAllSpecies(
  req: Request,
  res: Response<ApiSuccessResponse<PaginatedSpecies>>
): Promise<void> {
  const query = req.query as unknown as GetSpeciesQuery;

  const result = await getAllSpeciesService(query);

  res.status(200).json({
    success: true,
    message: 'Species retrieved successfully',
    data: result,
  });
}

export async function getSpeciesById(
  req: Request,
  res: Response<ApiSuccessResponse<Species>>
): Promise<void> {
  const { id } = req.params as SpeciesIdParams;

  const species = await getSpeciesByIdService(id);

  res.status(200).json({
    success: true,
    message: 'Species retrieved successfully',
    data: species,
  });
}

export async function updateSpecies(
  req: Request,
  res: Response<ApiSuccessResponse<Species>>
): Promise<void> {
  const { id } = req.params as SpeciesIdParams;
  const input = req.body as UpdateSpeciesInput;

  const species = await updateSpeciesService(id, input);

  res.status(200).json({
    success: true,
    message: 'Species updated successfully',
    data: species,
  });
}

export async function deleteSpecies(
  req: Request,
  res: Response<ApiSuccessResponse<null>>
): Promise<void> {
  const { id } = req.params as SpeciesIdParams;

  await deleteSpeciesService(id);

  res.status(200).json({
    success: true,
    message: 'Species deleted successfully',
    data: null,
  });
}
