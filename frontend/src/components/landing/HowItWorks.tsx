import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import StepCard from "@/components/landing/StepCard";
import { STEPS } from "@/constants/landingContent";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="From sign-up to home"
          title="How it works"
          subtitle="Four steps, start to finish — no lengthy applications before you even know who you're applying for."
        />

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-0 right-0 top-[4.5rem] hidden h-px bg-line lg:block"
            aria-hidden
          />
          {STEPS.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
