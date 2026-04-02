"use client";

import Header from "@/components/portfolio-templates/comic-panel/Header";
import HeroSection from "@/components/portfolio-templates/comic-panel/HeroSection";
import WorksSection from "@/components/portfolio-templates/comic-panel/WorksSection";
import AboutSection from "@/components/portfolio-templates/comic-panel/AboutSection";
import ContactSection from "@/components/portfolio-templates/comic-panel/ContactSection";
import Footer from "@/components/portfolio-templates/comic-panel/Footer";

export default function ComicPanelPage() {
  return (
    <div
      className="comic-panel-template"
      style={
        {
          "--cp-bg": "#FFFEF5",
          "--cp-surface": "#FFFFFF",
          "--cp-text": "#1A1A1A",
          "--cp-text-muted": "#666666",
          "--cp-red": "#E63946",
          "--cp-blue": "#2563EB",
          "--cp-yellow": "#FFC107",
          "--cp-border": "#1A1A1A",
          backgroundColor: "#FFFEF5",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        } as React.CSSProperties
      }
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
