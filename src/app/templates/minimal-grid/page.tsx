"use client";

import { Sidebar } from "@/components/templates/minimal-grid/Sidebar";
import { WorksGrid } from "@/components/templates/minimal-grid/WorksGrid";
import { AboutSection } from "@/components/templates/minimal-grid/AboutSection";
import { ContactSection } from "@/components/templates/minimal-grid/ContactSection";

export default function MinimalGridPage() {
  return (
    <div
      className="minimal-grid-template"
      style={{
        "--color-bg": "#f5f3ef",
        "--color-surface": "#ffffff",
        "--color-text": "#2a2a2a",
        "--color-text-muted": "#888888",
        "--color-accent": "#A28D69",
        "--color-border": "#e0dcd6",
      } as React.CSSProperties}
    >
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-h-screen pt-16 md:pt-0 md:ml-64">
          <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 md:px-8 md:py-16">
            <WorksGrid />
            <AboutSection />
            <ContactSection />
          </div>
          <footer className="border-t px-8 py-8 text-center" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs tracking-widest" style={{ color: "var(--color-text-muted)" }}>
              &copy; 2025 Your Name. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
