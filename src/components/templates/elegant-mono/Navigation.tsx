"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "Home" },
  { id: "gallery", label: "Works" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollY >= top - windowHeight * 0.4) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-[9998] flex-col items-end gap-6">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          onMouseEnter={() => setHoveredSection(section.id)}
          onMouseLeave={() => setHoveredSection(null)}
          className="group flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
          aria-label={section.label}
        >
          {/* Label on hover */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: hoveredSection === section.id ? 1 : 0,
              x: hoveredSection === section.id ? 0 : 10,
            }}
            transition={{ duration: 0.2 }}
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            {section.label}
          </motion.span>

          {/* Dot */}
          <motion.div
            animate={{
              scale: activeSection === section.id ? 1.4 : 1,
              backgroundColor:
                activeSection === section.id
                  ? "var(--color-accent)"
                  : "var(--color-border)",
            }}
            transition={{ duration: 0.3 }}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              boxShadow:
                activeSection === section.id
                  ? "0 0 8px var(--color-accent)"
                  : "none",
            }}
          />
        </button>
      ))}
    </nav>
  );
}
