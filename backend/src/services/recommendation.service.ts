import {
  ActivityLevel,
  HomeType,
  PetExperience,
  PetSize,
  SpaceRequirement,
  UserPreference,
} from '@prisma/client';
import { prisma } from '../config/prisma';
import { NotFoundError } from '../utils/httpError';
import {
  CompatibilityResult,
  PetWithBreedAndSpecies,
  RecommendationResult,
  ScoreBreakdownItem,
} from '../types/recommendation.types';

// Category weights sum to 100.
const WEIGHTS = {
  species: 15,
  size: 15,
  activity: 20,
  home: 15,
  budget: 15,
  children: 10,
  experience: 10,
} as const;

const activityLevelRank: Record<ActivityLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 };
const spaceRequirementRank: Record<SpaceRequirement, number> = { SMALL: 0, MEDIUM: 1, LARGE: 2 };
const petSizeRank: Record<Exclude<PetSize, 'ANY'>, number> = { SMALL: 0, MEDIUM: 1, LARGE: 2 };
const experienceToleranceRank: Record<PetExperience, number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  EXPERIENCED: 2,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface EffectivePetAttributes {
  energyLevel: ActivityLevel;
  noiseLevel: ActivityLevel;
  groomingLevel: ActivityLevel;
  spaceRequirement: SpaceRequirement;
  apartmentFriendly: boolean;
  childFriendly: boolean;
  monthlyCost: number;
}

// Pet override fields take precedence over the breed's baseline attributes.
function getEffectiveAttributes(pet: PetWithBreedAndSpecies): EffectivePetAttributes {
  return {
    energyLevel: pet.energyLevelOverride ?? pet.breed.energyLevel,
    noiseLevel: pet.noiseLevelOverride ?? pet.breed.noiseLevel,
    groomingLevel: pet.groomingLevelOverride ?? pet.breed.groomingLevel,
    spaceRequirement: pet.spaceRequirementOverride ?? pet.breed.spaceRequirement,
    apartmentFriendly: pet.apartmentFriendlyOverride ?? pet.breed.apartmentFriendly,
    childFriendly: pet.childFriendlyOverride ?? pet.breed.childFriendly,
    monthlyCost: pet.monthlyCostOverride ?? pet.monthlyCost ?? pet.breed.averageMonthlyCost,
  };
}

function scoreSpecies(preferredSpecies: string | null, speciesName: string): ScoreBreakdownItem {
  if (!preferredSpecies) {
    return { points: WEIGHTS.species };
  }

  const preferred = preferredSpecies.trim().toLowerCase();
  const actual = speciesName.trim().toLowerCase();

  if (actual === preferred) {
    return { points: WEIGHTS.species };
  }
  if (actual.includes(preferred) || preferred.includes(actual)) {
    return { points: Math.round(WEIGHTS.species * 0.6), note: 'partially matches your preferred species' };
  }
  return { points: 0, note: 'does not match your preferred species' };
}

// The schema has no direct pet "size" field — spaceRequirement is used as the
// closest proxy for physical size when preferredPetSize is not ANY.
function scoreSize(preferredPetSize: PetSize, spaceRequirement: SpaceRequirement): ScoreBreakdownItem {
  if (preferredPetSize === 'ANY') {
    return { points: WEIGHTS.size };
  }

  const preferredRank = petSizeRank[preferredPetSize as Exclude<PetSize, 'ANY'>];
  const actualRank = spaceRequirementRank[spaceRequirement];
  const diff = Math.abs(preferredRank - actualRank);

  if (diff === 0) return { points: WEIGHTS.size };
  if (diff === 1) return { points: Math.round(WEIGHTS.size / 2), note: 'size is close to your preference' };
  return { points: 0, note: 'size does not match your preference' };
}

function scoreActivity(
  activityLevel: ActivityLevel,
  energyLevel: ActivityLevel,
  workingHours: number
): ScoreBreakdownItem {
  const diff = Math.abs(activityLevelRank[activityLevel] - activityLevelRank[energyLevel]);
  let points = WEIGHTS.activity - diff * (WEIGHTS.activity / 2);
  let note: string | undefined;

  if (workingHours >= 8 && energyLevel === 'HIGH') {
    points -= 5;
    note = 'this pet has high energy needs and you work long hours';
  }

  points = clamp(points, 0, WEIGHTS.activity);
  return { points: Math.round(points), note };
}

function scoreHome(homeType: HomeType, apartmentFriendly: boolean): ScoreBreakdownItem {
  if (homeType === 'APARTMENT' && !apartmentFriendly) {
    return { points: 0, note: 'may not be well suited to apartment living' };
  }
  return { points: WEIGHTS.home };
}

function scoreBudget(monthlyBudget: number, monthlyCost: number): ScoreBreakdownItem {
  if (monthlyCost <= monthlyBudget) {
    return { points: WEIGHTS.budget };
  }

  const overageRatio = (monthlyCost - monthlyBudget) / monthlyBudget;
  const points = clamp(WEIGHTS.budget - overageRatio * WEIGHTS.budget, 0, WEIGHTS.budget);
  return {
    points: Math.round(points),
    note: 'monthly cost may exceed your budget',
  };
}

function scoreChildren(hasChildren: boolean, childFriendly: boolean): ScoreBreakdownItem {
  if (hasChildren && !childFriendly) {
    return { points: 0, note: 'may not be ideal around children' };
  }
  return { points: WEIGHTS.children };
}

function scoreExperience(
  petExperience: PetExperience,
  groomingLevel: ActivityLevel,
  noiseLevel: ActivityLevel
): ScoreBreakdownItem {
  const demandRank = (activityLevelRank[groomingLevel] + activityLevelRank[noiseLevel]) / 2;
  const toleranceRank = experienceToleranceRank[petExperience];
  const diff = Math.max(0, demandRank - toleranceRank);

  const points = clamp(WEIGHTS.experience - diff * (WEIGHTS.experience / 2), 0, WEIGHTS.experience);
  return {
    points: Math.round(points),
    note: points < WEIGHTS.experience ? 'grooming/noise demands may exceed your experience level' : undefined,
  };
}

export function computeCompatibility(
  preference: UserPreference,
  pet: PetWithBreedAndSpecies
): CompatibilityResult {
  const attrs = getEffectiveAttributes(pet);

  const species = scoreSpecies(preference.preferredSpecies, pet.species.name);
  const size = scoreSize(preference.preferredPetSize, attrs.spaceRequirement);
  const activity = scoreActivity(preference.activityLevel, attrs.energyLevel, preference.workingHours);
  const home = scoreHome(preference.homeType, attrs.apartmentFriendly);
  const budget = scoreBudget(preference.monthlyBudget, attrs.monthlyCost);
  const children = scoreChildren(preference.hasChildren, attrs.childFriendly);
  const experience = scoreExperience(preference.petExperience, attrs.groomingLevel, attrs.noiseLevel);

  const total =
    species.points +
    size.points +
    activity.points +
    home.points +
    budget.points +
    children.points +
    experience.points;

  const score = clamp(Math.round(total), 0, 100);

  const notes = [
    species.note,
    size.note,
    activity.note,
    home.note,
    budget.note,
    children.note,
    experience.note,
  ].filter((note): note is string => Boolean(note));

  const reason = notes.length > 0 ? notes.join('; ') : 'Strong overall match with your preferences';

  return { score, reason };
}

export async function generateRecommendationsForUser(userId: string): Promise<RecommendationResult[]> {
  const preference = await prisma.userPreference.findUnique({ where: { userId } });
  if (!preference) {
    throw new NotFoundError('Create your preferences before requesting recommendations');
  }

  const availablePets = await prisma.pet.findMany({
    where: { status: 'AVAILABLE' },
    include: { breed: true, species: true },
  });

  const scored = availablePets.map((pet) => ({
    pet,
    ...computeCompatibility(preference, pet),
  }));

  const saved = await Promise.all(
    scored.map(({ pet, score, reason }) =>
      prisma.recommendation.upsert({
        where: { userId_petId: { userId, petId: pet.id } },
        update: { compatibilityScore: score, reason, generatedAt: new Date() },
        create: { userId, petId: pet.id, compatibilityScore: score, reason },
      })
    )
  );

  const results: RecommendationResult[] = saved.map((record) => {
    const match = scored.find((entry) => entry.pet.id === record.petId);
    return { ...record, pet: match!.pet };
  });

  return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

export async function getMyRecommendations(userId: string): Promise<RecommendationResult[]> {
  const recommendations = await prisma.recommendation.findMany({
    where: { userId },
    orderBy: { compatibilityScore: 'desc' },
    include: { pet: { include: { breed: true, species: true } } },
  });

  return recommendations;
}
