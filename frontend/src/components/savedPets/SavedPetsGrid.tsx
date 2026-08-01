import { motion } from "framer-motion";
import SavedPetCard from "@/components/savedPets/SavedPetCard";
import type { SavedPetItem } from "@/types/savedPets.types";

interface SavedPetsGridProps {
  savedPets: SavedPetItem[];
  onRemove: (savedPetId: string) => void;
  removingId?: string;
}

export default function SavedPetsGrid({ savedPets, onRemove, removingId }: SavedPetsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {savedPets.map((savedPet, index) => (
        <motion.div
          key={savedPet.savedPetId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
        >
          <SavedPetCard
            savedPet={savedPet}
            onRemove={onRemove}
            isRemoving={removingId === savedPet.savedPetId}
          />
        </motion.div>
      ))}
    </div>
  );
}
