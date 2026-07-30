import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { ROUTES } from "@/constants/routes";

export default function CallToAction() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-moss via-moss-dark to-moss-deep px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-leaf/20 blur-3xl" />

          <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
            <h2 className="font-display text-3xl font-semibold text-paper sm:text-4xl">
              Your best match is already waiting.
            </h2>
            <p className="text-lg text-paper/75">
              Set your preferences once — the recommendations keep coming as new pets are listed.
            </p>
            <Button to={ROUTES.REGISTER} size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Create your free account
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
