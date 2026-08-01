import { axiosClient } from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/types/api.types";
import type {
  PaginatedPets,
  PaginatedPetsApiResponse,
  PetApiRecord,
  PetDetailsItem,
  PetFilters,
  PetListItem,
} from "@/types/pet.types";

/**
 * ASSUMPTION: the existing Pet CRUD backend's GET /pets endpoint wasn't part
 * of this frontend build, so its exact query params and response shape are
 * assumed here rather than confirmed. Assumed contract:
 *   - query params: search, speciesId, breedId, gender, minAge, maxAge,
 *     sortBy ("newest" | "oldest" | "age"), page, limit
 *   - response: { success, data: { items, total, page, limit, totalPages } }
 *   - each item nests { species: {id,name}, breed: {id,name}, images: [{imageUrl}] }
 * If the real contract differs, mapPetRecord() and buildPetsQueryParams()
 * below are the only two places that need to change.
 */
function mapPetRecord(record: PetApiRecord): PetListItem {
  return {
    id: record.id,
    name: record.name,
    species: record.species?.name ?? "Unknown species",
    breed: record.breed?.name ?? "Unknown breed",
    age: record.age,
    gender: record.gender,
    description: record.description,
    status: record.status,
    imageUrl: record.images?.[0]?.imageUrl ?? null,
    city: record.owner?.city ?? null,
  };
}

function mapPetDetailsRecord(record: PetApiRecord): PetDetailsItem {
  return {
    id: record.id,
    name: record.name,
    species: record.species?.name ?? "Unknown species",
    breed: record.breed?.name ?? "Unknown breed",
    age: record.age,
    gender: record.gender,
    description: record.description,
    status: record.status,
    vaccinated: record.vaccinated ?? false,
    sterilized: record.sterilized ?? false,
    monthlyCost: record.monthlyCost ?? null,
    energyLevel: record.energyLevelOverride ?? null,
    noiseLevel: record.noiseLevelOverride ?? null,
    groomingLevel: record.groomingLevelOverride ?? null,
    spaceRequirement: record.spaceRequirementOverride ?? null,
    apartmentFriendly: record.apartmentFriendlyOverride ?? null,
    childFriendly: record.childFriendlyOverride ?? null,
    images: record.images?.map((img) => img.imageUrl) ?? [],
    owner: record.owner
  ? {
      id: record.owner.id ?? "shelter",
      fullName: record.owner.name ?? null,
      email: record.owner.email ?? null,
      phone: record.owner.phoneNumber ?? null,
      city: record.owner.city ?? null,
    }
  : null,
  };
}

function buildPetsQueryParams(filters: PetFilters, pageSize: number) {
  const sortOrder =
    filters.sortBy === "name" ? "asc" : filters.sortBy === "age" ? "asc" : "desc";

  const params: Record<string, string | number> = {
    page: filters.page,
    limit: pageSize,
    sortBy: filters.sortBy,
    sortOrder,
  };

  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.speciesId) params.speciesId = filters.speciesId;
  if (filters.breedId) params.breedId = filters.breedId;
  if (filters.gender) params.gender = filters.gender;
  if (filters.minAge !== "") params.minAge = Number(filters.minAge);
  if (filters.maxAge !== "") params.maxAge = Number(filters.maxAge);

  return params;
}

export async function fetchPets(filters: PetFilters, pageSize: number): Promise<PaginatedPets> {
  const { data } = await axiosClient.get<ApiSuccessResponse<PaginatedPetsApiResponse>>("/pets", {
    params: buildPetsQueryParams(filters, pageSize),
  });

  return {
  items: data.data.data.map(mapPetRecord),
  total: data.data.pagination.totalItems,
  page: data.data.pagination.page,
  limit: data.data.pagination.limit,
  totalPages: data.data.pagination.totalPages,
};
}

export async function fetchPetById(id: string): Promise<PetDetailsItem> {
  const { data } = await axiosClient.get<ApiSuccessResponse<PetApiRecord>>(`/pets/${id}`);
  return mapPetDetailsRecord(data.data);
}

