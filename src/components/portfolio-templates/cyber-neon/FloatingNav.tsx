"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Works", sectionIndex: 1 },
  { label: "About", sectionIndex: 2 },
  { label: "Contact", sectionIndex: 3 },
];

export function FloatingNav() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = document.querySelector(".tpl-snap-container");
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight;
      const index = Math.round(scrollTop / sectionHeight);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const container = document.querySelector(".tpl-snap-container");
    if (!container) return;
    container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed top-5 right-5 z-50 flex items-center gap-1 px-4 py-2.5 rounded-full"
      style={{
        background: "rgba(18, 18, 31, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--cn-border)",
        boxShadow: "0 0 20px rgba(0, 240, 255, 0.08)",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {/* Glowing dot indicator */}
      <motion.span
        className="w-2 h-2 rounded-full mr-2 shrink-0"
        style={{
          background: "var(--cn-cyan)",
          boxShadow: "0 0 8px var(--cn-cyan), 0 0 16px var(--cn-cyan)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {navItems.map((item) => {
        const isActive = activeIndex === item.sectionIndex;
        return (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.sectionIndex)}
            className="relative px-3 py-1 text-xs font-mono tracking-wider uppercase transition-all duration-300"
            style={{
              color: isActive ? "var(--cn-cyan)" : "var(--cn-text-muted)",
              textShadow: isActive ? "0 0 10px var(--cn-cyan)" : "none",
            }}
          >
            {isActive && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(0, 240, 255, 0.08)" }}
                layoutId="nav-active-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </motion.nav>
  );
}
