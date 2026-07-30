import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import TestimonialCard from "@/components/landing/TestimonialCard";
import { TESTIMONIALS } from "@/constants/landingContent";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-paper-dim to-paper" />
      <div className="pointer-events-none absolute -top-16 right-1/4 -z-10 h-72 w-72 rounded-full bg-leaf/20 blur-3xl" />

      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="From the community"
          title="What matched families say"
          align="center"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
