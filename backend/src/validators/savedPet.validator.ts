import { z } from 'zod';

const petIdField = z.string().uuid('Pet id must be a valid UUID');

export const savePetSchema = z.object({
  body: z.object({
    petId: petIdField,
  }),
});

export const savedPetParamsSchema = z.object({
  params: z.object({
    petId: petIdField,
  }),
});

export type SavePetInput = z.infer<typeof savePetSchema>['body'];
export type SavedPetParams = z.infer<typeof savedPetParamsSchema>['params'];
