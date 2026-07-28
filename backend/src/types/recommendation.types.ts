import { Prisma, Recommendation } from '@prisma/client';

export type PetWithBreedAndSpecies = Prisma.PetGetPayload<{
  include: { breed: true; species: true };
}>;

export interface RecommendationResult extends Recommendation {
  pet: PetWithBreedAndSpecies;
}

export interface ScoreBreakdownItem {
  points: number;
  note?: string;
}

export interface CompatibilityResult {
  score: number;
  reason: string;
}
