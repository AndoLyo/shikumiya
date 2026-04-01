"use client";

import { HeroSplit } from "@/components/templates/split-showcase/HeroSplit";
import { WorksShowcase } from "@/components/templates/split-showcase/WorksShowcase";
import { AboutSplit } from "@/components/templates/split-showcase/AboutSplit";
import { ContactSection } from "@/components/templates/split-showcase/ContactSection";

export default function SplitShowcasePage() {
  return (
    <div
      className="split-showcase-template"
      style={{
        "--color-bg": "#111111",
        "--color-text": "#f0ede6",
        "--color-accent": "#c9a96e",
        "--color-muted": "#666666",
      } as React.CSSProperties}
    >
      <main>
        <HeroSplit />
        <WorksShowcase />
        <AboutSplit />
        <ContactSection />
      </main>
    </div>
  );
}
