import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Statistics from "@/components/landing/Statistics";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedPets from "@/components/landing/FeaturedPets";
import Testimonials from "@/components/landing/Testimonials";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Statistics />
      <HowItWorks />
      <FeaturedPets />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
