export type UserRole = "ADOPTER" | "SHELTER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string | null;
}
