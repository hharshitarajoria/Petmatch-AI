import { useQuery } from "@tanstack/react-query";
import { fetchSpecies } from "@/api/catalogApi";

export function useSpecies() {
  return useQuery({
    queryKey: ["species"],
    queryFn: fetchSpecies,
    staleTime: 10 * 60 * 1000, // species rarely change; cache for 10 minutes
  });
}
