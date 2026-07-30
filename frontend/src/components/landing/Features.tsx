import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import FeatureCard from "@/components/landing/FeatureCard";
import { FEATURES } from "@/constants/landingContent";

export default function Features() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Built for the whole adoption"
          title="Everything a good match needs"
          subtitle="Four systems working together so the right pet finds the right home — and stays there."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
