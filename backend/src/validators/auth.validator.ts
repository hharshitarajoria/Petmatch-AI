import { z } from 'zod';

// Keep in sync with the Prisma `UserRole` enum.
export const userRoleValues = ['ADOPTER', 'SHELTER', 'ADMIN'] as const;

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string().min( 1, 'Name is required' )
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters'),
    email: z
      .string().min(1,'Email is required' )
      .trim()
      .toLowerCase()
      .email('Must be a valid email address'),
    password: z
      .string().min(1,'Password is required' )
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'), // bcrypt's practical limit
    role: z.enum(userRoleValues).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Must be a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
