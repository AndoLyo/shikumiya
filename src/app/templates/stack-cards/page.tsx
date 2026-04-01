"use client";

import { HeroSection } from "@/components/templates/stack-cards/HeroSection";
import { StackingWorks } from "@/components/templates/stack-cards/StackingWorks";
import { SkillsSection } from "@/components/templates/stack-cards/SkillsSection";
import { ContactSection } from "@/components/templates/stack-cards/ContactSection";

export default function StackCardsPage() {
  return (
    <div style={{ backgroundColor: "#0c0c0c" }}>
      <HeroSection />
      <StackingWorks />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}
