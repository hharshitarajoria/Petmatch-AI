import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate, authorize } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createBreedSchema,
  updateBreedSchema,
  breedIdParamsSchema,
  getBreedsQuerySchema,
} from '../validators/breed.validator';
import {
  createBreed,
  getAllBreeds,
  getBreedById,
  updateBreed,
  deleteBreed,
} from '../controllers/breed.controller';

const breedRouter = Router();

breedRouter.get('/', validate(getBreedsQuerySchema), asyncHandler(getAllBreeds));
breedRouter.get('/:id', validate(breedIdParamsSchema), asyncHandler(getBreedById));

breedRouter.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createBreedSchema),
  asyncHandler(createBreed)
);

breedRouter.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateBreedSchema),
  asyncHandler(updateBreed)
);

breedRouter.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(breedIdParamsSchema),
  asyncHandler(deleteBreed)
);

export default breedRouter;
