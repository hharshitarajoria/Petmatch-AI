import { ReportStatus, UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";
import { NotFoundError, ForbiddenError, ConflictError } from "../utils/httpError";
import { CreateReportInput, ListReportsQuery } from "../types/report.types";

/**
 * File a report against a pet listing.
 * A user cannot have more than one OPEN report on the same pet.
 */
export const createReport = async (reporterId: string, input: CreateReportInput) => {
  const pet = await prisma.pet.findUnique({ where: { id: input.petId } });

  if (!pet) {
    throw new NotFoundError("Pet not found");
  }

  const existingOpenReport = await prisma.report.findFirst({
    where: {
      petId: input.petId,
      reporterId,
      status: ReportStatus.OPEN,
    },
  });

  if (existingOpenReport) {
    throw new ConflictError("You already have an open report for this pet");
  }

  return prisma.report.create({
    data: {
      petId: input.petId,
      reporterId,
      reason: input.reason,
    },
  });
};

/** Reports filed by the current user. */
export const getMyReports = async (reporterId: string) => {
  return prisma.report.findMany({
    where: { reporterId },
    include: { pet: true },
    orderBy: { createdAt: "desc" },
  });
};

/** Fetch a single report. Only the reporter or an ADMIN may view it. */
export const getReportById = async (userId: string, role: UserRole, reportId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { pet: true, reporter: true },
  });

  if (!report) {
    throw new NotFoundError("Report not found");
  }

  if (report.reporterId !== userId && role !== UserRole.ADMIN) {
    throw new ForbiddenError("You do not have access to this report");
  }

  return report;
};

/** ADMIN-only: fetch every report, optionally filtered by status. */
export const getAllReports = async (query: ListReportsQuery) => {
  return prisma.report.findMany({
    where: {
      ...(query.status ? { status: query.status } : {}),
    },
    include: { pet: true, reporter: true },
    orderBy: { createdAt: "desc" },
  });
};

/** ADMIN-only: transition a report to a new status. */
export const updateReportStatus = async (reportId: string, status: ReportStatus) => {
  const report = await prisma.report.findUnique({ where: { id: reportId } });

  if (!report) {
    throw new NotFoundError("Report not found");
  }

  return prisma.report.update({
    where: { id: reportId },
    data: { status },
  });
};
