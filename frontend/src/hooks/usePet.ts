import { useQuery } from "@tanstack/react-query";
import { fetchPetById } from "@/api/petsApi";

export function usePet(petId: string | undefined) {
  return useQuery({
    queryKey: ["pet", petId],
    queryFn: () => fetchPetById(petId!),
    enabled: Boolean(petId),
  });
}
