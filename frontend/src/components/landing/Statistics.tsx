import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import StatCard from "@/components/landing/StatCard";
import { STATS } from "@/constants/landingContent";

export default function Statistics() {
  return (
    <section className="bg-moss-deep py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="The network so far"
          title="Numbers behind the matches"
          tone="paper"
        />

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
