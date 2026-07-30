import { motion, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, ImageOff } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import MatchRing from "@/components/common/MatchRing";
import { ROUTES } from "@/constants/routes";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-20">
      {/* Ambient gradient blobs — the "beautiful gradients" backdrop for the hero */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-moss/25 blur-3xl" />
        <div className="absolute -right-20 top-32 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-leaf/20 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="flex flex-col items-start gap-7"
          >
            <motion.span
              variants={item}
              className="rounded-full border border-line bg-white/60 px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-moss backdrop-blur-sm"
            >
              AI-powered pet adoption
            </motion.span>

            <motion.h1
              variants={item}
              className="font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
            >
              Find the pet your{" "}
              <span className="bg-gradient-to-r from-moss to-leaf bg-clip-text text-transparent">
                life is actually ready
              </span>{" "}
              for.
            </motion.h1>

            <motion.p variants={item} className="max-w-lg text-lg leading-relaxed text-ink-soft">
              PetMatch AI scores every available pet against your home, your schedule, and your
              experience — then ranks the best matches first, so adopting starts with a fit, not a
              scroll.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap items-center gap-4">
              <Button to={ROUTES.REGISTER} size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                Find your match
              </Button>
              <Button to={ROUTES.PETS} variant="ghost" size="lg">
                Browse pets
              </Button>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <ShieldCheck className="h-4 w-4 text-moss" />
                Verified shelters only
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <MessageCircle className="h-4 w-4 text-moss" />
                Chat once accepted
              </div>
            </motion.div>
          </motion.div>

          {/* Hero illustration placeholder: a mocked-up pet profile / match card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="overflow-hidden rounded-[2rem] bg-white/70 shadow-lifted ring-1 ring-line backdrop-blur-sm">
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-moss via-moss-dark to-moss-deep">
                <div className="flex flex-col items-center gap-2 text-paper/50">
                  <ImageOff className="h-9 w-9" strokeWidth={1.25} />
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em]">
                    Pet photo placeholder
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-6">
                <div>
                  <p className="font-display text-xl font-semibold text-ink">Bruno</p>
                  <p className="text-sm text-ink-soft">Labrador Retriever · Patiala</p>
                </div>
                <MatchRing percentage={95} size={84} strokeWidth={6} />
              </div>
            </div>

            {/* Floating glass chips for depth */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -left-8 top-10 hidden items-center gap-2 rounded-2xl bg-white/70 px-4 py-2.5 shadow-soft ring-1 ring-line backdrop-blur-md sm:flex"
            >
              <ShieldCheck className="h-4 w-4 text-moss" />
              <span className="font-mono text-xs text-ink">Shelter verified</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -right-6 bottom-6 hidden items-center gap-2 rounded-2xl bg-white/70 px-4 py-2.5 shadow-soft ring-1 ring-line backdrop-blur-md sm:flex"
            >
              <MessageCircle className="h-4 w-4 text-moss" />
              <span className="font-mono text-xs text-ink">New message</span>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
