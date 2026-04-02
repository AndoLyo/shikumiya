"use client";

import Header from "@/components/portfolio-templates/pastel-pop/Header";
import HeroSection from "@/components/portfolio-templates/pastel-pop/HeroSection";
import GallerySection from "@/components/portfolio-templates/pastel-pop/GallerySection";
import AboutSection from "@/components/portfolio-templates/pastel-pop/AboutSection";
import ContactSection from "@/components/portfolio-templates/pastel-pop/ContactSection";
import Footer from "@/components/portfolio-templates/pastel-pop/Footer";

export default function PastelPopPage() {
  return (
    <div
      className="pastel-pop-template"
      style={{
        "--color-bg": "#FFF5F9",
        "--color-surface": "#FFFFFF",
        "--color-text": "#4A3548",
        "--color-text-muted": "#B89AB5",
        "--color-accent": "#FF7EB3",
        "--color-accent-blue": "#7EC8E3",
        "--color-accent-yellow": "#FFE066",
        "--color-accent-mint": "#A8E6CF",
        "--color-border": "#F0E0EB",
        backgroundColor: "#FFF5F9",
      } as React.CSSProperties}
    >
      <Header />
      <main>
        <HeroSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
