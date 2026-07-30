import { DEFAULT_PET_FILTERS } from "@/constants/petFilters";
import type { PetFilters, PetGender, PetSortOption } from "@/types/pet.types";

const VALID_SORTS: PetSortOption[] = ["newest", "oldest", "age"];
const VALID_GENDERS: PetGender[] = ["MALE", "FEMALE", "UNKNOWN"];

export function parseFiltersFromSearchParams(searchParams: URLSearchParams): PetFilters {
  const sortBy = searchParams.get("sortBy");
  const gender = searchParams.get("gender");
  const page = Number(searchParams.get("page"));

  return {
    search: searchParams.get("search") ?? DEFAULT_PET_FILTERS.search,
    speciesId: searchParams.get("speciesId") ?? DEFAULT_PET_FILTERS.speciesId,
    breedId: searchParams.get("breedId") ?? DEFAULT_PET_FILTERS.breedId,
    gender: (VALID_GENDERS as string[]).includes(gender ?? "") ? (gender as PetGender) : "",
    minAge: searchParams.get("minAge") ?? DEFAULT_PET_FILTERS.minAge,
    maxAge: searchParams.get("maxAge") ?? DEFAULT_PET_FILTERS.maxAge,
    sortBy: (VALID_SORTS as string[]).includes(sortBy ?? "")
      ? (sortBy as PetSortOption)
      : DEFAULT_PET_FILTERS.sortBy,
    page: Number.isFinite(page) && page > 0 ? page : DEFAULT_PET_FILTERS.page,
  };
}

/** Only writes non-default values to the URL, so it stays clean. */
export function filtersToSearchParams(filters: PetFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.speciesId) params.set("speciesId", filters.speciesId);
  if (filters.breedId) params.set("breedId", filters.breedId);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.minAge) params.set("minAge", filters.minAge);
  if (filters.maxAge) params.set("maxAge", filters.maxAge);
  if (filters.sortBy !== DEFAULT_PET_FILTERS.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.page !== DEFAULT_PET_FILTERS.page) params.set("page", String(filters.page));

  return params;
}
