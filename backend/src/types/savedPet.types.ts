import { Prisma, SavedPet } from '@prisma/client';

export type PetWithBreedAndSpecies = Prisma.PetGetPayload<{
  include: { breed: true; species: true };
}>;

export interface SavedPetWithDetails extends SavedPet {
  pet: PetWithBreedAndSpecies;
}
