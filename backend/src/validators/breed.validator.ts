import { z } from 'zod';

const uuidParam = z
  .string()
  .uuid('Breed id must be a valid UUID');

const speciesIdField = z
  .string()
  .uuid('Species id must be a valid UUID');

const breedName = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters');


export const createBreedSchema = z.object({
  body: z.object({
    speciesId: speciesIdField,

    name: breedName,

    energyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),

    noiseLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),

    groomingLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),

    spaceRequirement: z.enum(['SMALL', 'MEDIUM', 'LARGE']),

    averageMonthlyCost: z.coerce.number().int().min(0),

    childFriendly: z.boolean(),

    apartmentFriendly: z.boolean(),
  }),
});

export const updateBreedSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
  body: z
    .object({
  speciesId: speciesIdField,

  name: breedName,

  energyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),

  noiseLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),

  groomingLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),

  spaceRequirement: z.enum(['SMALL', 'MEDIUM', 'LARGE']),

  averageMonthlyCost: z.coerce.number().int().min(0),

  childFriendly: z.boolean(),

  apartmentFriendly: z.boolean(),
}),
});

export const breedIdParamsSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
});

export const getBreedsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1, 'Limit must be at least 1')
      .max(50, 'Limit must be at most 50')
      .default(10),
    speciesId: z.string().uuid('Species id must be a valid UUID').optional(),
    search: z.string().trim().max(200).optional(),
    sortBy: z.enum(['createdAt', 'name']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
});

export type CreateBreedInput = z.infer<typeof createBreedSchema>['body'];
export type UpdateBreedInput = z.infer<typeof updateBreedSchema>['body'];
export type BreedIdParams = z.infer<typeof breedIdParamsSchema>['params'];
export type GetBreedsQuery = z.infer<typeof getBreedsQuerySchema>['query'];
