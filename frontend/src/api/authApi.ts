import { axiosClient } from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/types/api.types";
import type { AuthUser, UserRole } from "@/types/user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponseData {
  user: AuthUser;
  token: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponseData> {
  const { data } = await axiosClient.post<ApiSuccessResponse<AuthResponseData>>("/auth/login", payload);
  return data.data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponseData> {
  const { data } = await axiosClient.post<ApiSuccessResponse<AuthResponseData>>("/auth/register", payload);
  return data.data;
}
