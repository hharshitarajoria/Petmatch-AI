/* Minimal logger wrapper so log formatting/behavior can be swapped later
   (e.g. for winston or pino) without touching call sites. */

type LogMeta = Record<string, unknown> | undefined;

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info: (message: string, meta?: LogMeta) => {
    console.log(`[INFO] ${timestamp()} - ${message}`, meta ?? '');
  },
  warn: (message: string, meta?: LogMeta) => {
    console.warn(`[WARN] ${timestamp()} - ${message}`, meta ?? '');
  },
  error: (message: string, meta?: LogMeta) => {
    console.error(`[ERROR] ${timestamp()} - ${message}`, meta ?? '');
  },
};
