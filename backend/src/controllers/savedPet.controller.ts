import { Request, Response } from 'express';
import { SavedPet } from '@prisma/client';
import {
  saveMyPet as saveMyPetService,
  removeMySavedPet as removeMySavedPetService,
  getMySavedPets as getMySavedPetsService,
} from '../services/savedPet.service';
import { SavePetInput, SavedPetParams } from '../validators/savedPet.validator';
import { ApiSuccessResponse } from '../types';
import { SavedPetWithDetails } from '../types/savedPet.types';
import { UnauthorizedError } from '../utils/httpError';

function requireUser(req: Request): NonNullable<Request['user']> {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }
  return req.user;
}

export async function saveMyPet(
  req: Request,
  res: Response<ApiSuccessResponse<SavedPet>>
): Promise<void> {
  const requester = requireUser(req);
  const { petId } = req.body as SavePetInput;

  const savedPet = await saveMyPetService(requester.id, petId);

  res.status(201).json({
    success: true,
    message: 'Pet saved successfully',
    data: savedPet,
  });
}

export async function removeMySavedPet(
  req: Request,
  res: Response<ApiSuccessResponse<null>>
): Promise<void> {
  const requester = requireUser(req);
  const { petId } = req.params as SavedPetParams;

  await removeMySavedPetService(requester.id, petId);

  res.status(200).json({
    success: true,
    message: 'Saved pet removed successfully',
    data: null,
  });
}

export async function getMySavedPets(
  req: Request,
  res: Response<ApiSuccessResponse<SavedPetWithDetails[]>>
): Promise<void> {
  const requester = requireUser(req);

  const savedPets = await getMySavedPetsService(requester.id);

  res.status(200).json({
    success: true,
    message: 'Saved pets retrieved successfully',
    data: savedPets,
  });
}
