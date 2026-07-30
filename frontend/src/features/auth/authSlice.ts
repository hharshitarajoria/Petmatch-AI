import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from "@/constants/storageKeys";
import type { AuthUser } from "@/types/user.types";

function loadStoredUser(): AuthUser | null {
  try {
    const item = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return item ? (JSON.parse(item) as AuthUser) : null;
  } catch {
    return null;
  }
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const initialState: AuthState = {
  user: loadStoredUser(),
  token: localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, action.payload.token);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

