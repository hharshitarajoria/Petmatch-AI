import { z } from "zod";

export const createAdoptionRequestSchema = z.object({
  body: z.object({
    petId: z.string().uuid("Pet ID must be a valid UUID"),
    message: z.string().trim().min(1).max(1000).optional(),
  }),
});

export const adoptionRequestIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Request ID must be a valid UUID"),
  }),
});

export type CreateAdoptionRequestSchema =
  z.infer<typeof createAdoptionRequestSchema>["body"];

export type AdoptionRequestIdParamsSchema =
  z.infer<typeof adoptionRequestIdParamsSchema>["params"];