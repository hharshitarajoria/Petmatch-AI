import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../utils/httpError';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AuthResponseData, PublicUser } from '../types/auth.types';

const SALT_ROUNDS = 12;

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResponseData> {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingUser) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? UserRole.ADOPTER,
    },
  });

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return { user: toPublicUser(user), token };
}

export async function loginUser(input: LoginInput): Promise<AuthResponseData> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Same error for "no user" and "wrong password" — avoids leaking which emails are registered.
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return { user: toPublicUser(user), token };
}
