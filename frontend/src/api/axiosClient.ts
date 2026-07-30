import axios, { type InternalAxiosRequestConfig, AxiosError } from "axios";
import { ROUTES } from "@/constants/routes";
import { AUTH_TOKEN_STORAGE_KEY } from "@/constants/storageKeys";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if present) to every outgoing request.
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

// Normalize error handling: on 401, clear the stored session and send the
// user back to login. Actual logout/session-clearing logic (e.g. dispatching
// the auth slice's logout action) will be wired in once the auth feature is built.
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.assign(ROUTES.LOGIN);
      }
    }

    return Promise.reject(error);
  }
);
