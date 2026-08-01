import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import Pagination from "@/components/common/Pagination";
import SavedPetsGrid from "@/components/savedPets/SavedPetsGrid";
import SavedPetsGridSkeleton from "@/components/savedPets/SavedPetsGridSkeleton";
import { useSavedPets } from "@/hooks/useSavedPets";
import { useRemoveSavedPet } from "@/hooks/useRemoveSavedPet";
import { getApiErrorMessage } from "@/api/apiError";
import { ROUTES } from "@/constants/routes";

export default function SavedPetsPage() {
  console.log("SavedPetsPage rendered");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const savedPetsQuery = useSavedPets(page);
  const removeSavedPetMutation = useRemoveSavedPet();
  const [removingId, setRemovingId] = useState<string | undefined>(undefined);

  function handlePageChange(nextPage: number) {
    const params = new URLSearchParams(searchParams);
    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRemove(savedPetId: string) {
    setRemovingId(savedPetId);
    removeSavedPetMutation.mutate(savedPetId, {
      onSettled: () => setRemovingId(undefined),
    });
  }

  return (
    <div className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Your shortlist"
          title="Saved pets"
          subtitle="Pets you've saved while browsing — pick up where you left off, or send an adoption request when you're ready."
        />

        {savedPetsQuery.isError ? (
          <ErrorState
            description={getApiErrorMessage(savedPetsQuery.error)}
            onRetry={() => savedPetsQuery.refetch()}
          />
        ) : savedPetsQuery.isLoading ? (
          <SavedPetsGridSkeleton />
        ) : savedPetsQuery.data && savedPetsQuery.data.items.length > 0 ? (
          <>
            <p className="text-sm text-ink-soft">
              {savedPetsQuery.data.total} saved {savedPetsQuery.data.total === 1 ? "pet" : "pets"}
            </p>
            <SavedPetsGrid
              savedPets={savedPetsQuery.data.items}
              onRemove={handleRemove}
              removingId={removingId}
            />
            <Pagination
              page={savedPetsQuery.data.page}
              totalPages={savedPetsQuery.data.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState
            title="No saved pets yet"
            description="Save a pet from Browse Pets to keep track of it here."
            action={
              <Link
                to={ROUTES.PETS}
                className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-moss transition-colors hover:text-moss-dark"
              >
                Browse pets
              </Link>
            }
          />
        )}
      </Container>
    </div>
  );
}
