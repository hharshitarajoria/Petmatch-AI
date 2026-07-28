import { Request } from "express";
import { UnauthorizedError } from "./httpError";

export function requireUser(req: Request): NonNullable<Request["user"]> {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required");
  }
  return req.user;
}