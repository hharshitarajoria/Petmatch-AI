import { z } from 'zod';

// These mirror the Prisma enums the Pet model will declare (Species, Gender, Size).
// Keep both sides in sync once prisma/schema.prisma gains the Pet model.

const uuidParam = z.string().uuid('Pet id must be a valid UUID');

// Shared field-level rules so create/update stay consistent.
export const petGenderValues = ['MALE', 'FEMALE', 'UNKNOWN'] as const;

const petName = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters');

const petAge = z
  .coerce
  .number()
  .int('Age must be a whole number')
  .min(0, 'Age cannot be negative');

const petDescription = z
  .string()
  .trim()
  .max(2000, 'Description must be at most 2000 characters');

const monthlyCost = z
  .coerce
  .number()
  .int()
  .min(0, 'Monthly cost cannot be negative');
// --- Create ---
export const createPetSchema = z.object({
  body: z.object({
    name: petName,

    speciesId: z.string().uuid(),

    breedId: z.string().uuid(),

    age: petAge,

    gender: z.enum(petGenderValues),

    description: petDescription.optional(),

    monthlyCost: monthlyCost.optional(),

    vaccinated: z.boolean(),

    sterilized: z.boolean(),

    imageUrls: z
      .array(z.string().url('Each image must be a valid URL'))
      .max(5, 'A pet can have at most 5 images')
      .optional(),
  }),
});
// --- Update (partial; at least one field must be present) ---
export const updatePetSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
  body: z
  .object({
    name: petName,

    speciesId: z.string().uuid(),

    breedId: z.string().uuid(),

    age: petAge,

    gender: z.enum(petGenderValues),

    description: petDescription,

    monthlyCost: monthlyCost,

    vaccinated: z.boolean(),

    sterilized: z.boolean(),

    imageUrls: z
      .array(z.string().url('Each image must be a valid URL'))
      .max(5, 'A pet can have at most 5 images'),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  }),
});

// --- Single-resource params (get by id / delete by id) ---
export const petIdParamsSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
});

// --- Pagination + filtering (GET /pets?...) ---
export const getPetsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),

    speciesId: z.string().uuid().optional(),

    breedId: z.string().uuid().optional(),

    gender: z.enum(petGenderValues).optional(),

    minAge: z.coerce.number().int().min(0).optional(),

    maxAge: z.coerce.number().int().optional(),

    search: z.string().trim().max(200).optional(),

    sortBy: z.enum(['createdAt', 'age', 'name']).default('createdAt'),

    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export type CreatePetInput = z.infer<typeof createPetSchema>['body'];
export type UpdatePetInput = z.infer<typeof updatePetSchema>['body'];
export type UpdatePetParams = z.infer<typeof updatePetSchema>['params'];
export type PetIdParams = z.infer<typeof petIdParamsSchema>['params'];
export type GetPetsQuery = z.infer<typeof getPetsQuerySchema>['query'];
