import { ReportStatus } from "@prisma/client";

export interface CreateReportInput {
  petId: string;
  reason: string;
}

export interface ReportIdParams {
  id: string;
}

export interface UpdateReportStatusInput {
  status: ReportStatus;
}

export interface ListReportsQuery {
  status?: ReportStatus;
}
