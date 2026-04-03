"use client";

import { FloatingNav } from "@/components/portfolio-templates/cyber-neon/FloatingNav";
import { HeroSection } from "@/components/portfolio-templates/cyber-neon/HeroSection";
import { WorksSection } from "@/components/portfolio-templates/cyber-neon/WorksSection";
import { AboutSection } from "@/components/portfolio-templates/cyber-neon/AboutSection";
import { ContactSection } from "@/components/portfolio-templates/cyber-neon/ContactSection";
import { Footer } from "@/components/portfolio-templates/cyber-neon/Footer";

export default function CyberNeonPage() {
  return (
    <div
      className="cyber-neon-template"
      style={
        {
          "--cn-bg": "#0A0A14",
          "--cn-surface": "#12121F",
          "--cn-text": "#E0E0FF",
          "--cn-text-muted": "#6B6B8D",
          "--cn-cyan": "#00F0FF",
          "--cn-magenta": "#FF00E5",
          "--cn-lime": "#BFFF00",
          "--cn-border": "rgba(0, 240, 255, 0.15)",
        } as React.CSSProperties
      }
    >
      <FloatingNav />
      <main className="tpl-snap-container">
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
