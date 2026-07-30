import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api.types";

/**
 * Extracts a human-readable message from a failed Axios request,
 * falling back to a generic message if the backend didn't provide one.
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) {
      return data.message;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
