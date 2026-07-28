import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { savePetSchema, savedPetParamsSchema } from '../validators/savedPet.validator';
import {
  saveMyPet,
  removeMySavedPet,
  getMySavedPets,
} from '../controllers/savedPet.controller';

const savedPetRouter = Router();

savedPetRouter.get('/', authenticate, asyncHandler(getMySavedPets));

savedPetRouter.post('/', authenticate, validate(savePetSchema), asyncHandler(saveMyPet));

savedPetRouter.delete(
  '/:petId',
  authenticate,
  validate(savedPetParamsSchema),
  asyncHandler(removeMySavedPet)
);

export default savedPetRouter;
