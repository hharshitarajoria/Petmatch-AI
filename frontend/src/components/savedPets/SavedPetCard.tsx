import { HeartOff } from "lucide-react";
import PetCard from "@/components/pets/PetCard";
import type { SavedPetItem } from "@/types/savedPets.types";

interface SavedPetCardProps {
  savedPet: SavedPetItem;
  onRemove: (savedPetId: string) => void;
  isRemoving?: boolean;
}

/**
 * Renders the existing (unmodified) pets/PetCard for the visuals, and
 * overlays a "Remove from saved" button in the top-left corner — the
 * top-right corner is already used by PetCard's own save icon.
 */
export default function SavedPetCard({ savedPet, onRemove, isRemoving }: SavedPetCardProps) {
  return (
    <div className="relative">
      <PetCard
        pet={{
          id: savedPet.petId,
          name: savedPet.name,
          species: savedPet.species,
          breed: savedPet.breed,
          age: savedPet.age,
          gender: savedPet.gender,
          description: null,
          status: savedPet.status,
          imageUrl: savedPet.imageUrl,
          city: savedPet.city,
        }}
      />

      <button
        type="button"
        onClick={() => onRemove(savedPet.petId)}
        disabled={isRemoving}
        aria-label={`Remove ${savedPet.name} from saved pets`}
        className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/20 text-paper backdrop-blur-md transition-colors hover:bg-red-500/70 disabled:pointer-events-none disabled:opacity-50"
      >
        <HeartOff className="h-4 w-4" />
      </button>
    </div>
  );
}
