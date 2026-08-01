import { motion } from "framer-motion";
import { Heart, MapPin, PawPrint, ArrowUpRight, Mars, Venus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/app/hooks";
import { useSavePet, useSavedPets } from "@/hooks/useSavedPets";
import { useRemoveSavedPet } from "@/hooks/useRemoveSavedPet";
import type { PetGender, PetListItem, PetStatus } from "@/types/pet.types";

interface PetCardProps {
  pet: PetListItem;
}

const STATUS_LABELS: Record<PetStatus, string> = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  ADOPTED: "Adopted",
  REMOVED: "Unlisted",
};

const STATUS_BADGE_STYLES: Record<PetStatus, string> = {
  AVAILABLE: "bg-leaf/15 text-moss-dark",
  PENDING: "bg-gold/20 text-ink",
  ADOPTED: "bg-moss/15 text-moss-dark",
  REMOVED: "bg-ink/10 text-ink-soft",
};

const GENDER_ICONS: Partial<Record<PetGender, typeof Mars>> = {
  MALE: Mars,
  FEMALE: Venus,
};

export default function PetCard({ pet }: PetCardProps) {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const savedPetsQuery = useSavedPets(1);
  const savePetMutation = useSavePet();
  const removePetMutation = useRemoveSavedPet();

  const isSaved = Boolean(
    token && savedPetsQuery.data?.items.some((item) => item.petId === pet.id)
  );

  const detailsPath = ROUTES.PET_DETAILS.replace(":petId", pet.id);
  const GenderIcon = GENDER_ICONS[pet.gender];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white/70 shadow-soft ring-1 ring-line transition-shadow duration-200 hover:shadow-lifted"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-moss to-leaf">
        {pet.imageUrl ? (
          <img
            src={pet.imageUrl}
            alt={pet.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <PawPrint
            className="absolute -bottom-4 -right-4 h-28 w-28 text-paper/20"
            strokeWidth={1.25}
            aria-hidden
          />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!token) {
              navigate(ROUTES.LOGIN);
              return;
            }
            if (isSaved) {
              removePetMutation.mutate(pet.id);
            } else {
              savePetMutation.mutate(pet.id);
            }
          }}
          disabled={savePetMutation.isPending || removePetMutation.isPending}
          aria-label={isSaved ? `Unsave ${pet.name}` : `Save ${pet.name}`}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
            isSaved ? "bg-rose-500 text-white" : "bg-ink/20 text-paper hover:bg-ink/35"
          }`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>

        <div className="absolute -bottom-4 right-4">
          <span
            className={`rounded-full px-3 py-1 font-mono text-xs font-medium backdrop-blur-md ${STATUS_BADGE_STYLES[pet.status]}`}
          >
            {STATUS_LABELS[pet.status]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-6">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-lg font-semibold text-ink">{pet.name}</h3>
            {GenderIcon ? (
              <GenderIcon className="h-3.5 w-3.5 text-ink-soft" aria-hidden />
            ) : null}
          </div>
          <p className="text-sm text-ink-soft">
            {pet.species} · {pet.breed} · {pet.age} {pet.age === 1 ? "yr" : "yrs"}
          </p>
        </div>

        {pet.description ? (
          <p className="line-clamp-2 text-sm text-ink-soft">{pet.description}</p>
        ) : null}

        {pet.city ? (
          <p className="flex items-center gap-1.5 text-xs text-ink-soft">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {pet.city}
          </p>
        ) : null}

        <Link
          to={detailsPath}
          className="mt-auto inline-flex items-center gap-1 font-mono text-xs font-medium uppercase tracking-[0.12em] text-moss transition-colors group-hover:text-moss-dark"
        >
          View details
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
