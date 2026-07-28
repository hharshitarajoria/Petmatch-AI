import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireUser } from "../utils/requireUser";
import * as reportService from "../services/report.service";


export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const report = await reportService.createReport(user.id, req.body);

  return res.status(201).json({
    success: true,
    message: "Report submitted successfully",
    data: report,
  });
});

export const getMyReports = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const reports = await reportService.getMyReports(user.id);

  return res.status(200).json({
    success: true,
    message: "Reports fetched successfully",
    data: reports,
  });
});

export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const user = requireUser(req);

  const report = await reportService.getReportById(user.id, user.role, req.params.id as string);

  return res.status(200).json({
    success: true,
    message: "Report fetched successfully",
    data: report,
  });
});

export const getAllReports = asyncHandler(async (req: Request, res: Response) => {
  requireUser(req);

  const reports = await reportService.getAllReports(req.query as { status?: any });

  return res.status(200).json({
    success: true,
    message: "Reports fetched successfully",
    data: reports,
  });
});

export const updateReportStatus = asyncHandler(async (req: Request, res: Response) => {
  requireUser(req);

  const report = await reportService.updateReportStatus(req.params.id as string, req.body.status);

  return res.status(200).json({
    success: true,
    message: "Report status updated successfully",
    data: report,
  });
});
