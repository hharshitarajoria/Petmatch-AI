import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPets } from "@/api/petsApi";
import { DEFAULT_PAGE_SIZE } from "@/constants/petFilters";
import type { PetFilters } from "@/types/pet.types";

export function usePets(filters: PetFilters) {
  return useQuery({
    queryKey: ["pets", filters],
    queryFn: () => fetchPets(filters, DEFAULT_PAGE_SIZE),
    // Keep showing the current page's results while the next page/filter
    // loads, instead of flashing the loading skeleton on every change.
    placeholderData: keepPreviousData,
  });
}
