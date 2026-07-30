import { motion } from "framer-motion";
import PetCard from "@/components/pets/PetCard";
import type { PetListItem } from "@/types/pet.types";

interface PetGridProps {
  pets: PetListItem[];
}

export default function PetGrid({ pets }: PetGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {pets.map((pet, index) => (
        <motion.div
          key={pet.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
        >
          <PetCard pet={pet} />
        </motion.div>
      ))}
    </div>
  );
}
