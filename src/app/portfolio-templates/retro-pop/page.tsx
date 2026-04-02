"use client";

import Header from "@/components/portfolio-templates/retro-pop/Header";
import HeroSection from "@/components/portfolio-templates/retro-pop/HeroSection";
import WorksSection from "@/components/portfolio-templates/retro-pop/WorksSection";
import AboutSection from "@/components/portfolio-templates/retro-pop/AboutSection";
import ContactSection from "@/components/portfolio-templates/retro-pop/ContactSection";
import Footer from "@/components/portfolio-templates/retro-pop/Footer";

export default function RetropopPage() {
  return (
    <div
      className="retro-pop-template"
      style={{
        "--rp-bg": "#FFFDF0",
        "--rp-surface": "#FFFFFF",
        "--rp-text": "#1A1A2E",
        "--rp-text-muted": "#7A7A8E",
        "--rp-orange": "#FF6B35",
        "--rp-teal": "#00B4D8",
        "--rp-yellow": "#FFD166",
        "--rp-pink": "#EF476F",
        "--rp-border": "#1A1A2E",
        backgroundColor: "#FFFDF0",
      } as React.CSSProperties}
    >
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
