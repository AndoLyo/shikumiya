"use client";

import PortfolioSection from "@/components/PortfolioSection";
import Footer from "@/components/Footer";

export default function PortfolioPage() {
  return (
    <>
      {/* Simple header with back link */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div className="flex flex-col leading-tight">
              <span className="font-mono text-[10px] tracking-[0.2em] text-text-secondary group-hover:text-primary transition-colors">
                しくみや
              </span>
              <span className="font-serif text-sm font-bold text-white tracking-wide">
                LYO VISION
              </span>
            </div>
          </a>
          <a
            href="/"
            className="font-mono text-xs text-text-secondary hover:text-primary transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </header>
      <main className="pt-16">
        <PortfolioSection />
      </main>
      <Footer />
    </>
  );
}
