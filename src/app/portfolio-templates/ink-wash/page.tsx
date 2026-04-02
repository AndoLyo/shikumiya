"use client";

import Header from "@/components/portfolio-templates/ink-wash/Header";
import HeroSection from "@/components/portfolio-templates/ink-wash/HeroSection";
import WorksSection from "@/components/portfolio-templates/ink-wash/WorksSection";
import AboutSection from "@/components/portfolio-templates/ink-wash/AboutSection";
import ContactSection from "@/components/portfolio-templates/ink-wash/ContactSection";
import Footer from "@/components/portfolio-templates/ink-wash/Footer";

export default function InkWashPage() {
  return (
    <div
      className="ink-wash-template"
      style={{
        "--color-bg": "#F5F0E8",
        "--color-surface": "#FEFCF7",
        "--color-text": "#2C2C2C",
        "--color-text-muted": "#8B8578",
        "--color-accent": "#C73E3A",
        "--color-accent-secondary": "#3D6B5E",
        "--color-border": "#D5CBBB",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', 'YuMincho', 'Noto Serif JP', Georgia, serif",
        minHeight: "100vh",
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
