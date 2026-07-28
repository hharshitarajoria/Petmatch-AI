import { Request, Response } from 'express';
import { UserPreference } from '@prisma/client';
import {
  createUserPreference as createUserPreferenceService,
  getMyUserPreference as getMyUserPreferenceService,
  updateMyUserPreference as updateMyUserPreferenceService,
} from '../services/userPreference.service';
import {
  CreateUserPreferenceInput,
  UpdateUserPreferenceInput,
} from '../validators/userPreference.validator';
import { ApiSuccessResponse } from '../types';
import { UnauthorizedError } from '../utils/httpError';

function requireUser(req: Request): NonNullable<Request['user']> {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }
  return req.user;
}

export async function createUserPreference(
  req: Request,
  res: Response<ApiSuccessResponse<UserPreference>>
): Promise<void> {
  const requester = requireUser(req);
  const input = req.body as CreateUserPreferenceInput;

  const preference = await createUserPreferenceService(requester.id, input);

  res.status(201).json({
    success: true,
    message: 'Preference created successfully',
    data: preference,
  });
}

export async function getMyUserPreference(
  req: Request,
  res: Response<ApiSuccessResponse<UserPreference>>
): Promise<void> {
  const requester = requireUser(req);

  const preference = await getMyUserPreferenceService(requester.id);

  res.status(200).json({
    success: true,
    message: 'Preference retrieved successfully',
    data: preference,
  });
}

export async function updateMyUserPreference(
  req: Request,
  res: Response<ApiSuccessResponse<UserPreference>>
): Promise<void> {
  const requester = requireUser(req);
  const input = req.body as UpdateUserPreferenceInput;

  const preference = await updateMyUserPreferenceService(requester.id, input);

  res.status(200).json({
    success: true,
    message: 'Preference updated successfully',
    data: preference,
  });
}
