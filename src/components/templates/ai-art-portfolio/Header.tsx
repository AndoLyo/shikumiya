"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/site.config";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = siteConfig.nav.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);
      const el = document.getElementById(href.slice(1));
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0f]/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-1 h-8 bg-primary rounded-full" />
            <span className="font-serif text-sm font-bold text-white tracking-wide">
              {siteConfig.name}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              {siteConfig.nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-all ${
                    activeSection === link.href.slice(1)
                      ? "text-primary"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex md:hidden flex-col gap-1.5 w-7 cursor-pointer"
              aria-label="Toggle menu"
            >
              <motion.span
                className="block h-px bg-white origin-center"
                animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block h-px bg-white"
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px bg-white origin-center"
                animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav className="flex flex-col items-center gap-6">
              {siteConfig.nav.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="font-serif text-3xl text-white hover:text-primary transition-colors tracking-wide"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
