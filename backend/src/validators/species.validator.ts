import { z } from 'zod';

const uuidParam = z
  .string()
  .uuid('Species id must be a valid UUID');

const speciesName = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters');

const speciesDescription = z
  .string()
  .trim()
  .max(1000, 'Description must be at most 1000 characters');

export const createSpeciesSchema = z.object({
  body: z.object({
    name: speciesName,
    description: speciesDescription.optional(),
  }),
});

export const updateSpeciesSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
  body: z
    .object({
      name: speciesName,
      description: speciesDescription,
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const speciesIdParamsSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
});

export const getSpeciesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1, 'Limit must be at least 1')
      .max(50, 'Limit must be at most 50')
      .default(10),
    search: z.string().trim().max(200).optional(),
    sortBy: z.enum(['createdAt', 'name']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
});

export type CreateSpeciesInput = z.infer<typeof createSpeciesSchema>['body'];
export type UpdateSpeciesInput = z.infer<typeof updateSpeciesSchema>['body'];
export type SpeciesIdParams = z.infer<typeof speciesIdParamsSchema>['params'];
export type GetSpeciesQuery = z.infer<typeof getSpeciesQuerySchema>['query'];
