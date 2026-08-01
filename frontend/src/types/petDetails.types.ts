import type { PetGender, PetStatus } from "@/types/pet.types";

export type EnergyLevel = "LOW" | "MEDIUM" | "HIGH";
export type SpaceRequirement = "SMALL" | "MEDIUM" | "LARGE";
export type ShelterVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface ShelterInfo {
  shelterName: string;
  city: string | null;
  verificationStatus: ShelterVerificationStatus;
}

/** Full pet record for the Pet Details page (richer than PetListItem). */
export interface PetDetail {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: PetGender;
  description: string | null;
  status: PetStatus;
  monthlyCost: number | null;
  vaccinated: boolean;
  sterilized: boolean;
  energyLevel: EnergyLevel;
  groomingLevel: EnergyLevel;
  spaceRequirement: SpaceRequirement;
  images: string[];
  speciesId: string;
  shelter: ShelterInfo | null;
  isSaved: boolean;
  savedPetId: string | null;
}

/**
 * Raw shape assumed for GET /pets/:id. Mirrors the Pet model's per-pet
 * override fields (energyLevelOverride etc.) falling back to the breed's
 * base values — see mapPetDetailRecord() in petDetailsApi.ts.
 *
 * `isSavedByCurrentUser`/`savedPetId` are assumed additions for a
 * logged-in viewer; since Authentication isn't built yet in this frontend,
 * they'll typically be absent/false and the UI degrades to "not saved".
 */
export interface PetDetailApiRecord {
  id: string;
  name: string;
  age: number;
  gender: PetGender;
  description: string | null;
  status: PetStatus;
  monthlyCost: number | null;
  vaccinated: boolean;
  sterilized: boolean;
  energyLevelOverride?: EnergyLevel | null;
  groomingLevelOverride?: EnergyLevel | null;
  spaceRequirementOverride?: SpaceRequirement | null;
  species: { id: string; name: string };
  breed: {
    id: string;
    name: string;
    energyLevel: EnergyLevel;
    groomingLevel: EnergyLevel;
    spaceRequirement: SpaceRequirement;
  };
  images?: { imageUrl: string }[];
  owner?: {
    city?: string | null;
    shelter?: {
      shelterName: string;
      city?: string | null;
      verificationStatus: ShelterVerificationStatus;
    } | null;
  } | null;
  isSavedByCurrentUser?: boolean;
  savedPetId?: string | null;
}
