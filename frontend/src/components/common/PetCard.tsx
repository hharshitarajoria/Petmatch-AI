import { motion } from "framer-motion";
import { Heart, MapPin, PawPrint, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import MatchRing from "@/components/common/MatchRing";
import { ROUTES } from "@/constants/routes";
import type { PetPreview } from "@/types/pet.types";

interface PetCardProps {
  pet: PetPreview;
}

/**
 * Reusable pet listing card: photo slot (placeholder gradient — real
 * Cloudinary images will replace this once the Pets API is wired in), save
 * action, and a MatchRing badge surfacing the recommendation score.
 */
export default function PetCard({ pet }: PetCardProps) {
  const detailsPath = ROUTES.PET_DETAILS.replace(":petId", pet.id);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white/70 shadow-soft ring-1 ring-line transition-shadow duration-200 hover:shadow-lifted"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-moss to-leaf">
        <PawPrint
          className="absolute -bottom-4 -right-4 h-28 w-28 text-paper/20"
          strokeWidth={1.25}
          aria-hidden
        />

        <button
          type="button"
          aria-label={`Save ${pet.name}`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/20 text-paper backdrop-blur-md transition-colors hover:bg-ink/35"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute -bottom-6 right-4">
          <MatchRing percentage={pet.matchPercentage} size={64} strokeWidth={5} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-9">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{pet.name}</h3>
          <p className="text-sm text-ink-soft">
            {pet.breed} · {pet.age}
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-ink-soft">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {pet.city}
        </p>

        <Link
          to={detailsPath}
          className="mt-auto inline-flex items-center gap-1 font-mono text-xs font-medium uppercase tracking-[0.12em] text-moss transition-colors group-hover:text-moss-dark"
        >
          View profile
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
