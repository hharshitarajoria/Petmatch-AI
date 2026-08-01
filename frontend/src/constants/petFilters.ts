import type { PetFilters, PetGender, PetSortOption } from "@/types/pet.types";

export const DEFAULT_PAGE_SIZE = 12;

export const DEFAULT_PET_FILTERS: PetFilters = {
  search: "",
  speciesId: "",
  breedId: "",
  gender: "",
  minAge: "",
  maxAge: "",
  sortBy: "createdAt",
  page: 1,
};

export const GENDER_OPTIONS: { value: PetGender | ""; label: string }[] = [
  { value: "", label: "Any gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "UNKNOWN", label: "Unknown" },
];

export const SORT_OPTIONS: { value: PetSortOption; label: string }[] = [
  { value: "createdAt", label: "Newest" },
  { value: "age", label: "Age" },
  { value: "name", label: "Name (A–Z)" },
];
