import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError } from "../utils/httpError";
import * as adoptionRequestService from "../services/adoptionRequest.service";

export const createAdoptionRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const adoptionRequest = await adoptionRequestService.createAdoptionRequest(req.user.id, req.body);

  res.status(201).json({
    success: true,
    data: adoptionRequest,
    message: "Adoption request submitted successfully",
  });
});

export const getMyAdoptionRequests = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const requests = await adoptionRequestService.getMyAdoptionRequests(req.user.id);

  res.status(200).json({
    success: true,
    data: requests,
  });
});

export const getReceivedAdoptionRequests = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const requests = await adoptionRequestService.getReceivedAdoptionRequests(req.user.id);

  res.status(200).json({
    success: true,
    data: requests,
  });
});

export const getAdoptionRequestById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const adoptionRequest = await adoptionRequestService.getAdoptionRequestById(
    req.user.id,
    req.user.role,
    req.params.id as string
  );

  res.status(200).json({
    success: true,
    data: adoptionRequest,
  });
});

export const acceptAdoptionRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const result = await adoptionRequestService.acceptAdoptionRequest(req.user.id, req.params.id as string);

  res.status(200).json({
    success: true,
    data: result,
    message: "Adoption request accepted",
  });
});

export const rejectAdoptionRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const adoptionRequest = await adoptionRequestService.rejectAdoptionRequest(req.user.id, req.params.id as string);

  res.status(200).json({
    success: true,
    data: adoptionRequest,
    message: "Adoption request rejected",
  });
});

export const cancelAdoptionRequest = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const adoptionRequest = await adoptionRequestService.cancelAdoptionRequest(req.user.id, req.params.id as string);

  res.status(200).json({
    success: true,
    data: adoptionRequest,
    message: "Adoption request cancelled",
  });
});
