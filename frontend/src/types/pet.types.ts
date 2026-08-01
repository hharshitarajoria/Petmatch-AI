export interface PetPreview {
  id: string;
  name: string;
  breed: string;
  age: string;
  city: string;
  matchPercentage: number;
}

// ---------------------------------------------------------------------------
// Browse Pets — real listing types (additive; nothing above this line changed)
// ---------------------------------------------------------------------------

export type PetGender = "MALE" | "FEMALE" | "UNKNOWN";
export type PetStatus = "AVAILABLE" | "PENDING" | "ADOPTED" | "REMOVED";
export type PetSortOption = "createdAt" | "age" | "name";

/** Clean, UI-ready shape used by PetCard/PetGrid for a real listing. */
export interface PetListItem {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: PetGender;
  description: string | null;
  status: PetStatus;
  imageUrl: string | null;
  city?: string | null;
}

export interface PetFilters {
  search: string;
  speciesId: string;
  breedId: string;
  gender: PetGender | "";
  minAge: string;
  maxAge: string;
  sortBy: PetSortOption;
  page: number;
}

export interface PaginatedPets {
  items: PetListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PetDetailsItem {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: PetGender;
  description: string | null;
  status: PetStatus;
  vaccinated: boolean;
  sterilized: boolean;
  monthlyCost?: number | null;
  energyLevel?: string | null;
  noiseLevel?: string | null;
  groomingLevel?: string | null;
  spaceRequirement?: string | null;
  apartmentFriendly?: boolean | null;
  childFriendly?: boolean | null;
  images: string[];
  owner?: {
    id: string;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
  } | null;
}

/**
 * Raw shape assumed for a single pet record returned by GET /pets.
 * The exact contract of the existing Pet CRUD endpoint wasn't part of this
 * frontend build — see petsApi.ts for where to adjust this if it differs.
 */
export interface PetApiRecord {
  id: string;
  name: string;
  age: number;
  gender: PetGender;
  description: string | null;
  status: PetStatus;
  vaccinated?: boolean;
  sterilized?: boolean;
  monthlyCost?: number | null;
  energyLevelOverride?: string | null;
  noiseLevelOverride?: string | null;
  groomingLevelOverride?: string | null;
  spaceRequirementOverride?: string | null;
  apartmentFriendlyOverride?: boolean | null;
  childFriendlyOverride?: boolean | null;
  species?: { id: string; name: string };
  breed?: { id: string; name: string };
  images?: { id?: string; imageUrl: string }[];
  owner?: {
  id?: string;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  } | null;
}

export interface PaginatedPetsApiResponse {
  data: PetApiRecord[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}