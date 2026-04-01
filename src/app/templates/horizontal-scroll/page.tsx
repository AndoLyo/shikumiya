"use client";

import { CustomCursor } from "@/components/templates/horizontal-scroll/CustomCursor";
import { IntroSection } from "@/components/templates/horizontal-scroll/IntroSection";
import { HorizontalWorks } from "@/components/templates/horizontal-scroll/HorizontalWorks";
import { AboutSection } from "@/components/templates/horizontal-scroll/AboutSection";
import { ContactSection } from "@/components/templates/horizontal-scroll/ContactSection";

export default function HorizontalScrollPage() {
  return (
    <div
      className="horizontal-scroll-template"
      style={{
        "--color-bg": "#0a0a0a",
        "--color-text": "#EFE8D7",
        "--color-text-muted": "#666666",
        "--color-accent": "#e63946",
        "--color-border": "#222222",
        cursor: "none",
      } as React.CSSProperties}
    >
      <CustomCursor />
      <main>
        <IntroSection />
        <HorizontalWorks />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}
