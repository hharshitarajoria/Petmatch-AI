import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/httpError';

/**
 * Validates the request against a Zod schema shaped like:
 *   z.object({ body: z.object({...}), query: z.object({...}), params: z.object({...}) })
 * Only include the keys you actually want validated.
 * On success, req.body/query/params are replaced with the parsed (and coerced/trimmed) data.
 */
export function validate(schema: ZodObject<any>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) {
        req.body = parsed.body;
      }

      if (parsed.query) {
        req.query = parsed.query as Request['query'];
      }

      if (parsed.params) {
        Object.assign(req.params, parsed.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue: any) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ');

        next(new BadRequestError(message));
        return;
      }
      next(error);
    }
  };
}
