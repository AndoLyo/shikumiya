"use client";

import { ViewportFrame } from "@/components/templates/elegant-mono/ViewportFrame";
import { Navigation } from "@/components/templates/elegant-mono/Navigation";
import { HeroSection } from "@/components/templates/elegant-mono/HeroSection";
import { GallerySection } from "@/components/templates/elegant-mono/GallerySection";
import { AboutSection } from "@/components/templates/elegant-mono/AboutSection";
import { ContactSection } from "@/components/templates/elegant-mono/ContactSection";

export default function ElegantMonoPage() {
  return (
    <div
      className="elegant-mono-template"
      style={{
        "--color-bg": "#1a1a1a",
        "--color-surface": "#222222",
        "--color-text": "#d4d4d4",
        "--color-text-muted": "#777777",
        "--color-accent": "#00bbdd",
        "--color-accent-pink": "#d42d83",
        "--color-border": "#333333",
        "--frame-width": "12px",
      } as React.CSSProperties}
    >
      <ViewportFrame />
      <Navigation />
      <main>
        <HeroSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}
