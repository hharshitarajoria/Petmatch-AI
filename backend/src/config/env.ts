import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
  databaseUrl: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: Number(getEnvVar('PORT', '5000')),
  corsOrigin: getEnvVar('CORS_ORIGIN', '*'),
  databaseUrl: getEnvVar('DATABASE_URL'),
};

export const isProduction = env.nodeEnv === 'production';
