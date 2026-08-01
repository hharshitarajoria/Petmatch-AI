import { axiosClient } from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/types/api.types";
import type { PetDetail, PetDetailApiRecord } from "@/types/petDetails.types";

/**
 * ASSUMPTION: as with petsApi.ts, the existing Pet CRUD backend's
 * GET /pets/:id contract wasn't part of this frontend build. Assumed to
 * return { success, data: <PetDetailApiRecord> } with species/breed/images
 * nested and owner.shelter present when the pet belongs to a shelter.
 * If the real contract differs, mapPetDetailRecord() below is the one
 * place to change.
 */
function mapPetDetailRecord(record: PetDetailApiRecord): PetDetail {
  return {
    id: record.id,
    name: record.name,
    species: record.species?.name ?? "Unknown species",
    speciesId: record.species?.id ?? "",
    breed: record.breed?.name ?? "Unknown breed",
    age: record.age,
    gender: record.gender,
    description: record.description,
    status: record.status,
    monthlyCost: record.monthlyCost,
    vaccinated: record.vaccinated,
    sterilized: record.sterilized,
    // Per-pet overrides win when present; otherwise fall back to the breed's base value.
    energyLevel: record.energyLevelOverride ?? record.breed?.energyLevel ?? "MEDIUM",
    groomingLevel: record.groomingLevelOverride ?? record.breed?.groomingLevel ?? "MEDIUM",
    spaceRequirement: record.spaceRequirementOverride ?? record.breed?.spaceRequirement ?? "MEDIUM",
    images: record.images?.map((image) => image.imageUrl) ?? [],
    shelter: record.owner?.shelter
      ? {
          shelterName: record.owner.shelter.shelterName,
          city: record.owner.shelter.city ?? record.owner.city ?? null,
          verificationStatus: record.owner.shelter.verificationStatus,
        }
      : null,
    isSaved: record.isSavedByCurrentUser ?? false,
    savedPetId: record.savedPetId ?? null,
  };
}

export async function fetchPetDetail(petId: string): Promise<PetDetail> {
  const { data } = await axiosClient.get<ApiSuccessResponse<PetDetailApiRecord>>(
    `/pets/${petId}`
  );

  return mapPetDetailRecord(data.data);
}
