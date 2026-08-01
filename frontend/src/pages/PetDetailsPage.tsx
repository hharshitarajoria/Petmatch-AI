import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MapPin,
  PawPrint,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  Volume2,
  Scissors,
  Home,
  Baby,
  DollarSign,
  UserCheck,
  Mail,
  Phone,
  Mars,
  Venus,
} from "lucide-react";
import Container from "@/components/common/Container";
import ErrorState from "@/components/common/ErrorState";
import Skeleton from "@/components/common/Skeleton";
import { usePet } from "@/hooks/usePet";
import { useAppSelector } from "@/app/hooks";
import { useSavePet, useSavedPets } from "@/hooks/useSavedPets";
import { useRemoveSavedPet } from "@/hooks/useRemoveSavedPet";
import { getApiErrorMessage } from "@/api/apiError";
import { ROUTES } from "@/constants/routes";
import type { PetGender, PetStatus } from "@/types/pet.types";

const STATUS_LABELS: Record<PetStatus, string> = {
  AVAILABLE: "Available for Adoption",
  PENDING: "Adoption Pending",
  ADOPTED: "Adopted",
  REMOVED: "Unlisted",
};

const STATUS_BADGE_STYLES: Record<PetStatus, string> = {
  AVAILABLE: "bg-leaf/20 text-moss-dark border-moss/20",
  PENDING: "bg-gold/20 text-ink border-gold/30",
  ADOPTED: "bg-moss/20 text-moss-dark border-moss/30",
  REMOVED: "bg-ink/10 text-ink-soft border-line",
};

const GENDER_ICONS: Partial<Record<PetGender, typeof Mars>> = {
  MALE: Mars,
  FEMALE: Venus,
};

function PetDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <Skeleton className="h-96 w-full rounded-3xl" />
        <div className="flex gap-3">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <Skeleton className="h-20 w-20 rounded-2xl" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <Skeleton className="h-10 w-2/3 rounded-xl" />
        <Skeleton className="h-6 w-1/3 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function PetDetailsPage() {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const { petId } = useParams<{ petId: string }>();
  const { data: pet, isLoading, isError, error, refetch } = usePet(petId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const savedPetsQuery = useSavedPets(1);
  const savePetMutation = useSavePet();
  const removePetMutation = useRemoveSavedPet();

  const isSaved = Boolean(
    token && petId && savedPetsQuery.data?.items.some((item) => item.petId === petId)
  );

  if (isLoading) {
    return (
      <div className="py-12 sm:py-16">
        <Container className="flex flex-col gap-8">
          <Skeleton className="h-6 w-32 rounded-md" />
          <PetDetailsSkeleton />
        </Container>
      </div>
    );
  }

  if (isError || !pet) {
    return (
      <div className="py-16 sm:py-20">
        <Container className="flex flex-col gap-6">
          <Link
            to={ROUTES.PETS}
            className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-ink-soft hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to pets
          </Link>
          <ErrorState
            title="Pet details unavailable"
            description={getApiErrorMessage(error)}
            onRetry={() => refetch()}
          />
        </Container>
      </div>
    );
  }

  const GenderIcon = GENDER_ICONS[pet.gender];
  const images = pet.images.length > 0 ? pet.images : [];
  const currentImage = images[selectedImageIndex] ?? null;

  return (
    <div className="py-12 sm:py-16">
      <Container className="flex flex-col gap-8">
        {/* Navigation header */}
        <div className="flex items-center justify-between">
          <Link
            to={ROUTES.PETS}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2 text-xs font-mono font-medium uppercase tracking-[0.12em] text-ink-soft shadow-soft transition-colors hover:bg-white hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back to pets
          </Link>

          <span
            className={`rounded-full border px-4 py-1.5 font-mono text-xs font-semibold backdrop-blur-md ${STATUS_BADGE_STYLES[pet.status]}`}
          >
            {STATUS_LABELS[pet.status]}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Gallery Column */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            <div className="relative h-96 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-moss/10 to-leaf/20 shadow-soft ring-1 ring-line">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <PawPrint className="h-28 w-28 text-moss/30" strokeWidth={1} />
                </div>
              )}

              <button
                type="button"
                onClick={() => {
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
                className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-lifted ${
                  isSaved
                    ? "bg-rose-500 text-white"
                    : "bg-ink/20 text-paper hover:bg-ink/40"
                }`}
              >
                <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                      idx === selectedImageIndex
                        ? "border-moss ring-2 ring-moss/30"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Details Column */}
          <div className="flex flex-col gap-6 lg:col-span-6">
            {/* Header info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                  {pet.name}
                </h1>
                {GenderIcon ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-ink">
                    <GenderIcon className="h-4 w-4" />
                  </div>
                ) : null}
              </div>

              <p className="text-base text-ink-soft">
                {pet.species} · {pet.breed} · {pet.age} {pet.age === 1 ? "year old" : "years old"}
              </p>

              {pet.owner?.city ? (
                <p className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
                  <MapPin className="h-4 w-4 text-moss" />
                  {pet.owner.city}
                </p>
              ) : null}
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3.5 shadow-soft ring-1 ring-line">
                <ShieldCheck className="h-5 w-5 text-moss" />
                <div className="flex flex-col">
                  <span className="text-xs text-ink-soft">Vaccinated</span>
                  <span className="text-xs font-semibold text-ink">
                    {pet.vaccinated ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3.5 shadow-soft ring-1 ring-line">
                <ShieldCheck className="h-5 w-5 text-moss" />
                <div className="flex flex-col">
                  <span className="text-xs text-ink-soft">Sterilized</span>
                  <span className="text-xs font-semibold text-ink">
                    {pet.sterilized ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {pet.monthlyCost ? (
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3.5 shadow-soft ring-1 ring-line">
                  <DollarSign className="h-5 w-5 text-gold" />
                  <div className="flex flex-col">
                    <span className="text-xs text-ink-soft">Est. Cost</span>
                    <span className="text-xs font-semibold text-ink">
                      ${pet.monthlyCost}/mo
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Description */}
            {pet.description ? (
              <div className="flex flex-col gap-2 rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-line">
                <h3 className="font-display text-lg font-semibold text-ink">About {pet.name}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{pet.description}</p>
              </div>
            ) : null}

            {/* Detailed Attributes */}
            <div className="flex flex-col gap-3 rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-line">
              <h3 className="font-display text-lg font-semibold text-ink">Traits & Compatibility</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {pet.energyLevel ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Zap className="h-4 w-4 text-moss" />
                    <span>Energy: <strong className="text-ink">{pet.energyLevel}</strong></span>
                  </div>
                ) : null}

                {pet.noiseLevel ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Volume2 className="h-4 w-4 text-moss" />
                    <span>Noise: <strong className="text-ink">{pet.noiseLevel}</strong></span>
                  </div>
                ) : null}

                {pet.groomingLevel ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Scissors className="h-4 w-4 text-moss" />
                    <span>Grooming: <strong className="text-ink">{pet.groomingLevel}</strong></span>
                  </div>
                ) : null}

                {pet.spaceRequirement ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Home className="h-4 w-4 text-moss" />
                    <span>Space: <strong className="text-ink">{pet.spaceRequirement}</strong></span>
                  </div>
                ) : null}

                {pet.apartmentFriendly !== null && pet.apartmentFriendly !== undefined ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    {pet.apartmentFriendly ? (
                      <CheckCircle2 className="h-4 w-4 text-moss" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    )}
                    <span>Apartment Friendly: <strong className="text-ink">{pet.apartmentFriendly ? "Yes" : "No"}</strong></span>
                  </div>
                ) : null}

                {pet.childFriendly !== null && pet.childFriendly !== undefined ? (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Baby className="h-4 w-4 text-moss" />
                    <span>Child Friendly: <strong className="text-ink">{pet.childFriendly ? "Yes" : "No"}</strong></span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Owner / Shelter Contact Card */}
            {pet.owner ? (
              <div className="flex items-center justify-between rounded-3xl bg-sand/60 p-6 shadow-soft ring-1 ring-line">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss text-paper">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono uppercase tracking-[0.12em] text-ink-soft">Listed by</span>
                    <span className="font-display font-semibold text-ink">
                      {pet.owner.fullName ?? "Verified Shelter / Guardian"}
                    </span>
                    {pet.owner.city ? (
                      <span className="text-xs text-ink-soft">{pet.owner.city}</span>
                    ) : null}
                  </div>
                </div>

                <div className="flex gap-2">
                  {pet.owner.email ? (
                    <a
                      href={`mailto:${pet.owner.email}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-soft transition-transform hover:scale-105"
                      title="Email Shelter"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  ) : null}
                  {pet.owner.phone ? (
                    <a
                      href={`tel:${pet.owner.phone}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-soft transition-transform hover:scale-105"
                      title="Call Shelter"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Action CTA */}
            <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
              <Link
                to={ROUTES.ADOPTION_REQUESTS}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-moss py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-paper shadow-lifted transition-all hover:bg-moss-dark"
              >
                Start Adoption Request
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}
