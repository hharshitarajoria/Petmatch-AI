import { axiosClient } from "@/api/axiosClient";
import type { Breed, Species } from "@/types/species.types";

export async function fetchSpecies(): Promise<Species[]> {
  const { data } = await axiosClient.get("/species", { params: { limit: 50 } });
  return data.data.data;
}

export async function fetchBreeds(speciesId?: string): Promise<Breed[]> {
  const params: Record<string, string | number> = { limit: 50 };
  if (speciesId) params.speciesId = speciesId;

  const { data } = await axiosClient.get("/breeds", { params });
  return data.data.data;
}