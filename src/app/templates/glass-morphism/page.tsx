"use client";

import { GradientBackground } from "@/components/templates/glass-morphism/GradientBackground";
import { HeroSection } from "@/components/templates/glass-morphism/HeroSection";
import { WorksSection } from "@/components/templates/glass-morphism/WorksSection";
import { AboutSection } from "@/components/templates/glass-morphism/AboutSection";
import { ContactSection } from "@/components/templates/glass-morphism/ContactSection";

export default function GlassMorphismPage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#f0f0f0]">
      <GradientBackground />
      <HeroSection />
      <WorksSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
