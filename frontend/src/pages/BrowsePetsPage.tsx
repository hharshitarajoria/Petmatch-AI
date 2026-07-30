import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import SearchBar from "@/components/pets/SearchBar";
import FilterSidebar from "@/components/pets/FilterSidebar";
import FilterDrawer from "@/components/pets/FilterDrawer";
import PetGrid from "@/components/pets/PetGrid";
import PetGridSkeleton from "@/components/pets/PetGridSkeleton";
import { usePets } from "@/hooks/usePets";
import { useSpecies } from "@/hooks/useSpecies";
import { useBreeds } from "@/hooks/useBreeds";
import { getApiErrorMessage } from "@/api/apiError";
import { DEFAULT_PET_FILTERS } from "@/constants/petFilters";
import { filtersToSearchParams, parseFiltersFromSearchParams } from "@/utils/petFilterParams";
import type { PetFilters } from "@/types/pet.types";

export default function BrowsePetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const filters = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);

  const speciesQuery = useSpecies();
  const breedsQuery = useBreeds();
  const petsQuery = usePets(filters);

  function updateFilters(next: PetFilters) {
    setSearchParams(filtersToSearchParams(next));
  }

  function handleFilterChange<K extends keyof PetFilters>(key: K, value: PetFilters[K]) {
    updateFilters({ ...filters, [key]: value, page: DEFAULT_PET_FILTERS.page });
  }

  function handleSearchChange(search: string) {
    updateFilters({ ...filters, search, page: DEFAULT_PET_FILTERS.page });
  }

  function handlePageChange(page: number) {
    updateFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClearFilters() {
    updateFilters(DEFAULT_PET_FILTERS);
  }

  const isFiltered =
    filters.search !== "" ||
    filters.speciesId !== "" ||
    filters.breedId !== "" ||
    filters.gender !== "" ||
    filters.minAge !== "" ||
    filters.maxAge !== "";

  const filterPanelProps = {
    filters,
    speciesOptions: speciesQuery.data ?? [],
    breedOptions: breedsQuery.data ?? [],
    isLoadingOptions: speciesQuery.isLoading || breedsQuery.isLoading,
    onFilterChange: handleFilterChange,
    onClear: handleClearFilters,
  };

  return (
    <div className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Available now"
          title="Browse pets"
          subtitle="Every pet currently listed by a verified shelter — search, filter, and sort to find the one that fits."
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <SearchBar value={filters.search} onChange={handleSearchChange} />
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-medium text-ink shadow-soft transition-shadow hover:shadow-lifted lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <FilterSidebar {...filterPanelProps} />

          <FilterDrawer
            {...filterPanelProps}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            resultCount={petsQuery.data?.total}
          />

          <div className="flex flex-1 flex-col gap-6">
            {petsQuery.isError ? (
              <ErrorState
                description={getApiErrorMessage(petsQuery.error)}
                onRetry={() => petsQuery.refetch()}
              />
            ) : petsQuery.isLoading ? (
              <PetGridSkeleton />
            ) : petsQuery.data && petsQuery.data.items.length > 0 ? (
              <>
                <p className="text-sm text-ink-soft">
                  Showing {petsQuery.data.items.length} of {petsQuery.data.total} pets
                </p>
                <PetGrid pets={petsQuery.data.items} />
                <Pagination
                  page={petsQuery.data.page}
                  totalPages={petsQuery.data.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState
                title={isFiltered ? "No pets match your filters" : "No pets available right now"}
                description={
                  isFiltered
                    ? "Try widening your search — a different species, breed, or age range might turn up a match."
                    : "Check back soon as shelters list new pets regularly."
                }
                action={
                  isFiltered ? (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
                    >
                      Clear filters
                    </button>
                  ) : undefined
                }
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
