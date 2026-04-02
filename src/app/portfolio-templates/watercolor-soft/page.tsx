"use client";

import Header from "@/components/portfolio-templates/watercolor-soft/Header";
import HeroSection from "@/components/portfolio-templates/watercolor-soft/HeroSection";
import WorksSection from "@/components/portfolio-templates/watercolor-soft/WorksSection";
import AboutSection from "@/components/portfolio-templates/watercolor-soft/AboutSection";
import ContactSection from "@/components/portfolio-templates/watercolor-soft/ContactSection";
import Footer from "@/components/portfolio-templates/watercolor-soft/Footer";

export default function WatercolorSoftPage() {
  return (
    <div
      className="watercolor-soft-template"
      style={{
        "--wc-bg": "#F8F5F0",
        "--wc-surface": "#FFFFFF",
        "--wc-text": "#3D3D3D",
        "--wc-text-muted": "#9B9B9B",
        "--wc-blue": "#7FB5D5",
        "--wc-green": "#8FBFA0",
        "--wc-pink": "#E8B4C8",
        "--wc-peach": "#F0C9A6",
        "--wc-border": "#E8E2DB",
        backgroundColor: "#F8F5F0",
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
