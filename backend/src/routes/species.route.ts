import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate, authorize } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createSpeciesSchema,
  updateSpeciesSchema,
  speciesIdParamsSchema,
  getSpeciesQuerySchema,
} from '../validators/species.validator';
import {
  createSpecies,
  getAllSpecies,
  getSpeciesById,
  updateSpecies,
  deleteSpecies,
} from '../controllers/species.controller';

const speciesRouter = Router();

speciesRouter.get('/', validate(getSpeciesQuerySchema), asyncHandler(getAllSpecies));
speciesRouter.get('/:id', validate(speciesIdParamsSchema), asyncHandler(getSpeciesById));

speciesRouter.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createSpeciesSchema),
  asyncHandler(createSpecies)
);

speciesRouter.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateSpeciesSchema),
  asyncHandler(updateSpecies)
);

speciesRouter.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(speciesIdParamsSchema),
  asyncHandler(deleteSpecies)
);

export default speciesRouter;
