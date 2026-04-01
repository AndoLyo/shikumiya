"use client";

import { HeroSection } from "@/components/templates/cinematic-dark/HeroSection";
import { WorksSection } from "@/components/templates/cinematic-dark/WorksSection";
import { AboutSection } from "@/components/templates/cinematic-dark/AboutSection";
import { ContactSection } from "@/components/templates/cinematic-dark/ContactSection";

export default function CinematicDarkPage() {
  return (
    <div
      className="cinematic-dark-template"
      style={{
        "--color-bg": "#0a0a1a",
        "--color-bg-light": "#121228",
        "--color-text": "#EFE8D7",
        "--color-text-muted": "#8a8a9a",
        "--color-accent-cyan": "#00bbdd",
        "--color-accent-pink": "#d42d83",
      } as React.CSSProperties}
    >
      <main className="tpl-snap-container">
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}
