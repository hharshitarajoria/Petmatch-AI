import { useQuery } from "@tanstack/react-query";
import { fetchBreeds } from "@/api/catalogApi";

export function useBreeds() {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
    staleTime: 10 * 60 * 1000, // breeds rarely change; cache for 10 minutes
  });
}
