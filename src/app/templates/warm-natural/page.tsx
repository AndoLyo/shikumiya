"use client";

import Header from "@/components/templates/warm-natural/Header";
import HeroSection from "@/components/templates/warm-natural/HeroSection";
import ServicesSection from "@/components/templates/warm-natural/ServicesSection";
import WorksSection from "@/components/templates/warm-natural/WorksSection";
import AboutSection from "@/components/templates/warm-natural/AboutSection";
import ContactSection from "@/components/templates/warm-natural/ContactSection";
import Footer from "@/components/templates/warm-natural/Footer";

export default function WarmNaturalPage() {
  return (
    <div
      className="warm-natural-template"
      style={{
        "--color-bg": "#f2eee7",
        "--color-surface": "#ffffff",
        "--color-text": "#333333",
        "--color-text-muted": "#777777",
        "--color-accent": "#fffe3e",
        "--color-accent-gold": "#a28d69",
        "--color-border": "#ddd8d0",
      } as React.CSSProperties}
    >
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <WorksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
