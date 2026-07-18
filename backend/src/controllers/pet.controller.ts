import { Request, Response } from 'express';
import { Pet } from '@prisma/client';
import {
  createPet as createPetService,
  getAllPets as getAllPetsService,
  getPetById as getPetByIdService,
  updatePet as updatePetService,
  deletePet as deletePetService,
} from '../services/pet.service';
import {
  CreatePetInput,
  UpdatePetInput,
  PetIdParams,
  GetPetsQuery,
} from '../validators/pet.validator';
import { ApiSuccessResponse } from '../types';
import { PaginatedPets } from '../types/pet.types';
import { UnauthorizedError } from '../utils/httpError';

// Handlers use plain Request/Response rather than Express's generic
// Request<Params, ResBody, ReqBody, ReqQuery> type params. That generic form
// fights Express's own router overload resolution (a handler typed to a specific
// params/query shape doesn't structurally satisfy the default ParamsDictionary/
// ParsedQs slot the router infers for a plain string path). Since the `validate`
// middleware already guarantees req.body/params/query match the Zod-inferred
// shape at runtime before these handlers ever run, casting locally is safe and
// keeps route wiring simple.

// req.user is optional at the type level (Express augmentation), but every route
// wired to these handlers is expected to sit behind the `authenticate` middleware.
// This guard turns a missing user into a clean 401 instead of a runtime crash.
function requireUser(req: Request): NonNullable<Request['user']> {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }
  return req.user;
}

export async function createPet(
  req: Request,
  res: Response<ApiSuccessResponse<Pet>>
): Promise<void> {
  const requester = requireUser(req);
  const input = req.body as CreatePetInput;

  const pet = await createPetService(input, requester.id);

  res.status(201).json({
    success: true,
    message: 'Pet created successfully',
    data: pet,
  });
}

export async function getAllPets(
  req: Request,
  res: Response<ApiSuccessResponse<PaginatedPets>>
): Promise<void> {
  const query = req.query as unknown as GetPetsQuery;

  const result = await getAllPetsService(query);

  res.status(200).json({
    success: true,
    message: 'Pets retrieved successfully',
    data: result,
  });
}

export async function getPetById(
  req: Request,
  res: Response<ApiSuccessResponse<Pet>>
): Promise<void> {
  const { id } = req.params as PetIdParams;

  const pet = await getPetByIdService(id);

  res.status(200).json({
    success: true,
    message: 'Pet retrieved successfully',
    data: pet,
  });
}

export async function updatePet(
  req: Request,
  res: Response<ApiSuccessResponse<Pet>>
): Promise<void> {
  const requester = requireUser(req);
  const { id } = req.params as PetIdParams;
  const input = req.body as UpdatePetInput;

  const pet = await updatePetService(id, input, requester);

  res.status(200).json({
    success: true,
    message: 'Pet updated successfully',
    data: pet,
  });
}

export async function deletePet(
  req: Request,
  res: Response<ApiSuccessResponse<null>>
): Promise<void> {
  const requester = requireUser(req);
  const { id } = req.params as PetIdParams;

  await deletePetService(id, requester);

  res.status(200).json({
    success: true,
    message: 'Pet deleted successfully',
    data: null,
  });
}
