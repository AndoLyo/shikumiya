"use client";

import { Header } from "@/components/portfolio-templates/mosaic-bold/Header";
import { HeroSection } from "@/components/portfolio-templates/mosaic-bold/HeroSection";
import { WorksSection } from "@/components/portfolio-templates/mosaic-bold/WorksSection";
import { AboutSection } from "@/components/portfolio-templates/mosaic-bold/AboutSection";
import { ContactSection } from "@/components/portfolio-templates/mosaic-bold/ContactSection";
import { Footer } from "@/components/portfolio-templates/mosaic-bold/Footer";

export default function MosaicBoldPage() {
  return (
    <div
      className="mosaic-bold-template"
      style={
        {
          "--mb-bg": "#F5F5F5",
          "--mb-surface": "#FFFFFF",
          "--mb-text": "#0A0A0A",
          "--mb-text-muted": "#6B6B6B",
          "--mb-accent": "#FF3D00",
          "--mb-border": "#0A0A0A",
        } as React.CSSProperties
      }
    >
      <Header />
      <main style={{ background: "var(--mb-bg)" }}>
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
