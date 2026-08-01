import { axiosClient } from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/types/api.types";
import type {
  PaginatedSavedPets,
  SavedPetApiRecord,
  SavedPetItem,
} from "@/types/savedPets.types";

export const SAVED_PETS_PAGE_SIZE = 12;


/**
 * ASSUMPTION (flagged, not verified against real backend source):
 *   GET /saved-pets?page=&limit= -> { success, data: { items, total, page, limit, totalPages } }
 *   DELETE /saved-pets/:id       -> removes by the SavedPet record's own id (not petId)
 * Mirrors the SavedPet Prisma model (id, userId, petId, createdAt, unique
 * on [userId, petId]) with a nested `pet` relation. If the real contract
 * differs, mapSavedPetRecord() below is the one place to change.
 */
function mapSavedPetRecord(record: SavedPetApiRecord): SavedPetItem {
  return {
    savedPetId: record.id,
    petId: record.pet.id,
    name: record.pet.name,
    species: record.pet.species?.name ?? "Unknown species",
    breed: record.pet.breed?.name ?? "Unknown breed",
    age: record.pet.age,
    gender: record.pet.gender,
    status: record.pet.status,
    imageUrl: record.pet.images?.[0]?.imageUrl ?? null,
    city: record.pet.owner?.city ?? null,
    savedAt: record.createdAt,
  };
}

export async function fetchSavedPets(page: number): Promise<PaginatedSavedPets> {
  const { data } = await axiosClient.get<ApiSuccessResponse<SavedPetApiRecord[]>>("/saved-pets");

  const rawRecords = Array.isArray(data.data) ? data.data : [];
  const allItems = rawRecords.map(mapSavedPetRecord);
  const total = allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / SAVED_PETS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * SAVED_PETS_PAGE_SIZE;
  const items = allItems.slice(startIndex, startIndex + SAVED_PETS_PAGE_SIZE);

  return {
    items,
    total,
    page: currentPage,
    limit: SAVED_PETS_PAGE_SIZE,
    totalPages,
  };
}

export async function savePet(petId: string): Promise<void> {
  await axiosClient.post("/saved-pets", { petId });
}

export async function removeSavedPet(petId: string): Promise<void> {
  await axiosClient.delete(`/saved-pets/${petId}`);
}
