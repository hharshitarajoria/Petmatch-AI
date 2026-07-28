import { Request, Response } from 'express';
import {
  generateRecommendationsForUser,
  getMyRecommendations,
} from '../services/recommendation.service';
import { ApiSuccessResponse } from '../types';
import { RecommendationResult } from '../types/recommendation.types';
import { UnauthorizedError } from '../utils/httpError';

function requireUser(req: Request): NonNullable<Request['user']> {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }
  return req.user;
}

export async function generateRecommendations(
  req: Request,
  res: Response<ApiSuccessResponse<RecommendationResult[]>>
): Promise<void> {
  const requester = requireUser(req);

  const recommendations = await generateRecommendationsForUser(requester.id);

  res.status(200).json({
    success: true,
    message: 'Recommendations generated successfully',
    data: recommendations,
  });
}

export async function getRecommendations(
  req: Request,
  res: Response<ApiSuccessResponse<RecommendationResult[]>>
): Promise<void> {
  const requester = requireUser(req);

  const recommendations = await getMyRecommendations(requester.id);

  res.status(200).json({
    success: true,
    message: 'Recommendations retrieved successfully',
    data: recommendations,
  });
}
