"use client";

import { HeroSection } from "@/components/templates/neo-brutalist/HeroSection";
import { WorksGrid } from "@/components/templates/neo-brutalist/WorksGrid";
import { AboutSection } from "@/components/templates/neo-brutalist/AboutSection";
import { ContactSection } from "@/components/templates/neo-brutalist/ContactSection";

export default function NeoBrutalistPage() {
  return (
    <div
      className="neo-brutalist-template min-h-screen"
      style={{
        backgroundColor: "#fffdf5",
        color: "#1a1a1a",
      }}
    >
      <HeroSection />
      <WorksGrid />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
