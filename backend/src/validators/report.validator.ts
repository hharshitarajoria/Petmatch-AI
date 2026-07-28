import { z } from "zod";

export const createReportSchema = z.object({
  body: z.object({
    petId: z.uuid(),
    reason: z.string().trim().min(1).max(500),
  }),
});

export const reportIdParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export const updateReportStatusSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    status: z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"]),
  }),
});

export const listReportsQuerySchema = z.object({
  query: z.object({
    status: z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"]).optional(),
  }),
});

export type CreateReportSchema = z.infer<typeof createReportSchema>;
export type ReportIdParamsSchema = z.infer<typeof reportIdParamsSchema>;
export type UpdateReportStatusSchema = z.infer<typeof updateReportStatusSchema>;
export type ListReportsQuerySchema = z.infer<typeof listReportsQuerySchema>;
