import { z } from 'zod';

export const homeTypeValues = ['APARTMENT', 'HOUSE', 'FARM'] as const;
export const activityLevelValues = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const petExperienceValues = ['BEGINNER', 'INTERMEDIATE', 'EXPERIENCED'] as const;
export const petSizeValues = ['SMALL', 'MEDIUM', 'LARGE', 'ANY'] as const;

const monthlyBudget = z.coerce
  .number()
  .int('Monthly budget must be a whole number')
  .min(0, 'Monthly budget cannot be negative');

const workingHours = z.coerce
  .number()
  .int('Working hours must be a whole number')
  .min(0, 'Working hours cannot be negative')
  .max(24, 'Working hours must be at most 24');

const preferredSpecies = z
  .string()
  .trim()
  .min(1, 'Preferred species cannot be empty')
  .max(100, 'Preferred species must be at most 100 characters');

export const createUserPreferenceSchema = z.object({
  body: z.object({
    homeType: z.enum(homeTypeValues),
    activityLevel: z.enum(activityLevelValues),
    monthlyBudget,
    workingHours,
    hasChildren: z.boolean(),
    hasOtherPets: z.boolean(),
    petExperience: z.enum(petExperienceValues),
    preferredSpecies: preferredSpecies.optional(),
    preferredPetSize: z.enum(petSizeValues),
  }),
});

export const updateUserPreferenceSchema = z.object({
  body: z
    .object({
      homeType: z.enum(homeTypeValues),
      activityLevel: z.enum(activityLevelValues),
      monthlyBudget,
      workingHours,
      hasChildren: z.boolean(),
      hasOtherPets: z.boolean(),
      petExperience: z.enum(petExperienceValues),
      preferredSpecies,
      preferredPetSize: z.enum(petSizeValues),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export type CreateUserPreferenceInput = z.infer<typeof createUserPreferenceSchema>['body'];
export type UpdateUserPreferenceInput = z.infer<typeof updateUserPreferenceSchema>['body'];
