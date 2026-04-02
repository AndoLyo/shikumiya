"use client";

import { useState, useCallback, useEffect } from "react";
import { HeroSlider } from "@/components/portfolio-templates/dark-elegance/HeroSlider";
import { AboutPanel } from "@/components/portfolio-templates/dark-elegance/AboutPanel";
import { ContactOverlay } from "@/components/portfolio-templates/dark-elegance/ContactOverlay";
import { NavigationDots } from "@/components/portfolio-templates/dark-elegance/NavigationDots";

const TOTAL_SLIDES = 8;

export default function DarkElegancePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleDotClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleAboutClick = useCallback(() => {
    setIsContactOpen(false);
    setIsAboutOpen((v) => !v);
  }, []);

  const handleContactClick = useCallback(() => {
    setIsAboutOpen(false);
    setIsContactOpen((v) => !v);
  }, []);

  const closeAbout = useCallback(() => setIsAboutOpen(false), []);
  const closeContact = useCallback(() => setIsContactOpen(false), []);

  // Global keyboard: Escape closes any open overlay
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAboutOpen(false);
        setIsContactOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      className="dark-elegance-template"
      style={
        {
          "--de-bg": "#0D0D0D",
          "--de-surface": "#1A1A1A",
          "--de-text": "#F0EDE6",
          "--de-text-muted": "#7A7770",
          "--de-gold": "#C9A96E",
          "--de-gold-light": "#E4D5B7",
          "--de-border": "rgba(201, 169, 110, 0.2)",
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background: "var(--de-bg)",
          color: "var(--de-text)",
        } as React.CSSProperties
      }
    >
      {/* Full-screen hero slider */}
      <HeroSlider
        externalSlide={currentSlide}
        onSlideChange={setCurrentSlide}
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
      />

      {/* Fixed right-side navigation dots */}
      <NavigationDots
        total={TOTAL_SLIDES}
        current={currentSlide}
        onDotClick={handleDotClick}
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
        isAboutOpen={isAboutOpen}
        isContactOpen={isContactOpen}
      />

      {/* About panel (slides up from bottom) */}
      <AboutPanel isOpen={isAboutOpen} onClose={closeAbout} />

      {/* Contact overlay (full-screen modal) */}
      <ContactOverlay isOpen={isContactOpen} onClose={closeContact} />
    </div>
  );
}
