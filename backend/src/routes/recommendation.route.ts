import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  generateRecommendations,
  getRecommendations,
} from '../controllers/recommendation.controller';

const recommendationRouter = Router();

recommendationRouter.post('/generate', authenticate, asyncHandler(generateRecommendations));
recommendationRouter.get('/', authenticate, asyncHandler(getRecommendations));

export default recommendationRouter;
