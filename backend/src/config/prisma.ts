import { PrismaClient } from "@prisma/client";
import { isProduction } from "./env";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.prismaGlobal ?? new PrismaClient({});

if (!isProduction) {
  global.prismaGlobal = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}