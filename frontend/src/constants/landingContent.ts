import { BrainCircuit, ShieldCheck, MessageCircle, Route } from "lucide-react";
import type { ComponentType } from "react";
import type { PetPreview } from "@/types/pet.types";
import { ROUTES } from "@/constants/routes";

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Browse Pets", href: ROUTES.PETS },
  { label: "About", href: "#how-it-works" },
];

export interface FeatureItem {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

export const FEATURES: FeatureItem[] = [
  {
    icon: BrainCircuit,
    title: "Recommendation engine",
    description:
      "Every pet is scored against your home type, activity level, and experience, so the matches you see are ranked by real fit, not just listing date.",
  },
  {
    icon: ShieldCheck,
    title: "Shelter verification",
    description:
      "Shelters go through a verification review before their pets go live, so you're always adopting through an accountable, vetted source.",
  },
  {
    icon: MessageCircle,
    title: "Real-time chat",
    description:
      "The moment a shelter accepts your request, a conversation opens — no waiting on email threads to ask about vaccination records or visits.",
  },
  {
    icon: Route,
    title: "Adoption tracking",
    description:
      "Follow your request from submitted to accepted to adopted, with a clear status at every step of the journey.",
  },
];

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export const STATS: StatItem[] = [
  { label: "Pets adopted", value: 2400, suffix: "+" },
  { label: "Verified shelters", value: 180, suffix: "+" },
  { label: "Active users", value: 15200, suffix: "+" },
  { label: "Recommendations generated", value: 92000, suffix: "+" },
];

export interface StepItem {
  title: string;
  description: string;
}

export const STEPS: StepItem[] = [
  {
    title: "Register",
    description: "Create an account in under a minute, as an adopter or a shelter.",
  },
  {
    title: "Set preferences",
    description:
      "Tell us about your home, your schedule, and how much experience you have with pets.",
  },
  {
    title: "Receive recommendations",
    description:
      "The engine scores every available pet against your preferences and ranks the best matches first.",
  },
  {
    title: "Adopt",
    description: "Send a request, chat directly with the shelter, and bring your new companion home.",
  },
];

export const FEATURED_PETS: PetPreview[] = [
  { id: "seed-pet-01", name: "Bruno", breed: "Labrador Retriever", age: "2 yrs", city: "Patiala", matchPercentage: 95 },
  { id: "seed-pet-02", name: "Daisy", breed: "Beagle", age: "1 yr", city: "Patiala", matchPercentage: 88 },
  { id: "seed-pet-08", name: "Luna", breed: "Siamese Cat", age: "1 yr", city: "Patiala", matchPercentage: 81 },
  { id: "seed-pet-03", name: "Rocky", breed: "German Shepherd", age: "3 yrs", city: "Chandigarh", matchPercentage: 90 },
  { id: "seed-pet-05", name: "Coco", breed: "Poodle", age: "4 yrs", city: "Patiala", matchPercentage: 76 },
  { id: "seed-pet-12", name: "Thumper", breed: "Holland Lop Rabbit", age: "1 yr", city: "Patiala", matchPercentage: 70 },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  city: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I'd scrolled through other listing sites for months. PetMatch AI asked about my apartment and my work hours, and Daisy was the first recommendation — she's been home for six months now.",
    name: "Riya K.",
    role: "Adopter",
    city: "Patiala",
  },
  {
    quote:
      "The verification step actually means something to adopters. We get fewer speculative inquiries now and more people who've already read our shelter's profile.",
    name: "Happy Paws Shelter",
    role: "Shelter partner",
    city: "Patiala",
  },
  {
    quote:
      "Chat opened the second our request was accepted. We asked about Rocky's vaccination schedule that same afternoon instead of waiting days for an email reply.",
    name: "Arjun M.",
    role: "Adopter",
    city: "Chandigarh",
  },
];
