/**
 * Matches the PetMatch AI backend's standard success response shape:
 *   { success: true, message?: string, data: T }
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

/**
 * Shape of an error response body from the backend (thrown HttpError classes
 * are serialized by the backend's error-handling middleware into this form).
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
