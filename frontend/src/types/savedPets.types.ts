import type { PetGender, PetStatus } from "@/types/pet.types";

/** A saved pet entry, flattened for display. */
export interface SavedPetItem {
  /** The SavedPet record's own id — needed to remove it (not the pet's id). */
  savedPetId: string;
  petId: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: PetGender;
  status: PetStatus;
  imageUrl: string | null;
  city?: string | null;
  savedAt: string;
}

export interface PaginatedSavedPets {
  items: SavedPetItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Raw shape assumed for GET /saved-pets — the backend's exact response
 * contract wasn't available to inspect in this session (no backend source
 * was uploaded). Assumed to mirror the SavedPet model with a nested `pet`
 * relation. If the real contract differs, mapSavedPetRecord() in
 * savedPetsApi.ts is the one place to change.
 */
export interface SavedPetApiRecord {
  id: string;
  petId: string;
  createdAt: string;
  pet: {
    id: string;
    name: string;
    age: number;
    gender: PetGender;
    status: PetStatus;
    species: { name: string };
    breed: { name: string };
    images?: { imageUrl: string }[];
    owner?: { city?: string | null } | null;
  };
}

export interface PaginatedSavedPetsApiResponse {
  items: SavedPetApiRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
