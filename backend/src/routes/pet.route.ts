import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { uploadPetImages, attachUploadedImageUrls } from '../middleware/uploadImage.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import {
  createPetSchema,
  updatePetSchema,
  petIdParamsSchema,
  getPetsQuerySchema,
} from '../validators/pet.validator';
import {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
} from '../controllers/pet.controller';

const petRouter = Router();

// --- Public ---
petRouter.get('/', validate(getPetsQuerySchema), asyncHandler(getAllPets));
petRouter.get('/:id', validate(petIdParamsSchema), asyncHandler(getPetById));

// --- Protected ---
// Pipeline: auth -> parse multipart files -> upload to Cloudinary & merge URLs
// into req.body -> validate the now-complete body -> controller.
petRouter.post(
  '/',
  authenticate,
  uploadPetImages,
  asyncHandler(attachUploadedImageUrls),
  validate(createPetSchema),
  asyncHandler(createPet)
);

petRouter.patch(
  '/:id',
  authenticate,
  uploadPetImages,
  asyncHandler(attachUploadedImageUrls),
  validate(updatePetSchema),
  asyncHandler(updatePet)
);

petRouter.delete('/:id', authenticate, validate(petIdParamsSchema), asyncHandler(deletePet));

export default petRouter;
