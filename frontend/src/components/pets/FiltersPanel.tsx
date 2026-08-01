import Select from "@/components/common/Select";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { GENDER_OPTIONS, SORT_OPTIONS } from "@/constants/petFilters";
import type { PetFilters } from "@/types/pet.types";
import type { Breed, Species } from "@/types/species.types";

export interface FiltersPanelProps {
  filters: PetFilters;
  speciesOptions: Species[];
  breedOptions: Breed[];
  isLoadingOptions?: boolean;
  onFilterChange: <K extends keyof PetFilters>(key: K, value: PetFilters[K]) => void;
  onClear: () => void;
}

export default function FiltersPanel({
  filters,
  speciesOptions,
  breedOptions,
  isLoadingOptions = false,
  onFilterChange,
  onClear,
}: FiltersPanelProps) {
  const speciesSelectOptions = [
    { value: "", label: isLoadingOptions ? "Loading…" : "All species" },
    ...speciesOptions.map((species) => ({ value: species.id, label: species.name })),
  ];

  const availableBreeds = filters.speciesId
    ? breedOptions.filter((breed) => breed.speciesId === filters.speciesId)
    : breedOptions;

  const breedSelectOptions = [
    { value: "", label: isLoadingOptions ? "Loading…" : "All breeds" },
    ...availableBreeds.map((breed) => ({ value: breed.id, label: breed.name })),
  ];

  return (
    <div className="flex flex-col gap-5">
      <Select
        label="Species"
        options={speciesSelectOptions}
        value={filters.speciesId}
        onChange={(event) => {
          console.log("Species selected:", event.target.value);

          onFilterChange("speciesId", event.target.value);
          onFilterChange("breedId", "");
        }}
      />

      <Select
        label="Breed"
        options={breedSelectOptions}
        value={filters.breedId}
        onChange={(event) => onFilterChange("breedId", event.target.value)}
      />

      <Select
        label="Gender"
        options={GENDER_OPTIONS}
        value={filters.gender}
        onChange={(event) => onFilterChange("gender", event.target.value as PetFilters["gender"])}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min age"
          type="number"
          min={0}
          value={filters.minAge}
          onChange={(event) => onFilterChange("minAge", event.target.value)}
        />
        <Input
          label="Max age"
          type="number"
          min={0}
          value={filters.maxAge}
          onChange={(event) => onFilterChange("maxAge", event.target.value)}
        />
      </div>

      <Select
        label="Sort by"
        options={SORT_OPTIONS}
        value={filters.sortBy}
        onChange={(event) => onFilterChange("sortBy", event.target.value as PetFilters["sortBy"])}
      />

      <Button variant="ghost" onClick={onClear} className="ring-1 ring-line">
        Clear filters
      </Button>
    </div>
  );
}
