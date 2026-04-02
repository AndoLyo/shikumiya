"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "gallery", label: "作品" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const STYLE = `
  .fg-bar {
    background: rgba(17, 17, 24, 0.72);
    backdrop-filter: blur(16px) saturate(1.5);
    -webkit-backdrop-filter: blur(16px) saturate(1.5);
    border-bottom: 1px solid var(--fg-border);
  }
  .fg-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1.5px solid var(--fg-text-muted);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .fg-dot.active {
    background: var(--fg-accent);
    border-color: var(--fg-accent);
    box-shadow: 0 0 8px var(--fg-accent), 0 0 16px rgba(108, 99, 255, 0.4);
  }
  .fg-dot:hover:not(.active) {
    border-color: var(--fg-accent-light);
    background: rgba(108, 99, 255, 0.2);
  }
`;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
}

function useActiveSection() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

export function MinimalBar() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fg-bar fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 transition-all duration-500 ${
        scrolled ? "h-12" : "h-14"
      }`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <style>{STYLE}</style>

      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 select-none cursor-pointer"
        onClick={() => scrollToSection("hero")}
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.96 }}
      >
        {/* Geometric logo mark */}
        <div className="relative w-6 h-6">
          <div
            className="absolute inset-0 rounded-sm rotate-45"
            style={{
              background:
                "linear-gradient(135deg, var(--fg-accent), var(--fg-accent-light))",
              opacity: 0.9,
            }}
          />
          <div
            className="absolute inset-1 rounded-sm rotate-45"
            style={{ background: "var(--fg-bg)" }}
          />
        </div>
        <span
          className="text-sm font-semibold tracking-wider"
          style={{ color: "var(--fg-text)" }}
        >
          FLOAT<span style={{ color: "var(--fg-accent)" }}>.</span>
        </span>
      </motion.div>

      {/* Dot navigation */}
      <nav className="flex items-center gap-3" aria-label="セクションナビゲーション">
        {SECTIONS.map((sec) => (
          <div key={sec.id} className="relative">
            <button
              className={`fg-dot ${active === sec.id ? "active" : ""}`}
              onClick={() => scrollToSection(sec.id)}
              onMouseEnter={() => setTooltip(sec.label)}
              onMouseLeave={() => setTooltip(null)}
              aria-label={sec.label}
            />
            <AnimatePresence>
              {tooltip === sec.label && (
                <motion.span
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--fg-text-muted)",
                    background: "rgba(28, 28, 38, 0.9)",
                    border: "1px solid var(--fg-border)",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {sec.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </motion.header>
  );
}
