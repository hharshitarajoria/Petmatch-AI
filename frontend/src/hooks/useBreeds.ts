import { useQuery } from "@tanstack/react-query";
import { fetchBreeds } from "@/api/catalogApi";

export function useBreeds(speciesId?: string) {
  return useQuery({
    queryKey: ["breeds", speciesId ?? "all"],
    queryFn: () => fetchBreeds(speciesId),
    staleTime: 10 * 60 * 1000,
  });
}
