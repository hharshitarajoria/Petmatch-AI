import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/common/Button";
import PetCard from "@/components/common/PetCard";
import { ROUTES } from "@/constants/routes";
import { FEATURED_PETS } from "@/constants/landingContent";
import { ArrowRight } from "lucide-react";

export default function FeaturedPets() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Ready to meet you"
            title="Featured pets"
            subtitle="A sample of pets currently listed by verified shelters, each with a live compatibility score."
          />
          <Button to={ROUTES.PETS} variant="ghost" icon={<ArrowRight className="h-4 w-4" />}>
            View all pets
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PETS.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </Container>
    </section>
  );
}
