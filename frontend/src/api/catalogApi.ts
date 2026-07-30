import { axiosClient } from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/types/api.types";
import type { Breed, Species } from "@/types/species.types";

export async function fetchSpecies(): Promise<Species[]> {
  const { data } = await axiosClient.get<ApiSuccessResponse<Species[]>>("/species");
  return data.data;
}

export async function fetchBreeds(): Promise<Breed[]> {
  const { data } = await axiosClient.get<ApiSuccessResponse<Breed[]>>("/breeds");
  return data.data;
}
