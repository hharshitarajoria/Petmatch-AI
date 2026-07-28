import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createUserPreferenceSchema,
  updateUserPreferenceSchema,
} from '../validators/userPreference.validator';
import {
  createUserPreference,
  getMyUserPreference,
  updateMyUserPreference,
} from '../controllers/userPreference.controller';

const userPreferenceRouter = Router();

userPreferenceRouter.post(
  '/',
  authenticate,
  validate(createUserPreferenceSchema),
  asyncHandler(createUserPreference)
);

userPreferenceRouter.get('/me', authenticate, asyncHandler(getMyUserPreference));

userPreferenceRouter.patch(
  '/me',
  authenticate,
  validate(updateUserPreferenceSchema),
  asyncHandler(updateMyUserPreference)
);

export default userPreferenceRouter;
