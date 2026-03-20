"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pillars", href: "#pillars" },
  { label: "Resources", href: "#resources" },
  { label: "Timeline", href: "#timeline" },
  { label: "Membership", href: "#membership" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // アクティブセクション検出
      const sections = navLinks.map((l) => l.href.slice(1));
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

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

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
            <div className="flex flex-col leading-tight">
              <span className="font-mono text-[10px] tracking-[0.2em] text-text-secondary group-hover:text-primary transition-colors">
                Make your vision.
              </span>
              <span className="font-serif text-sm font-bold text-white tracking-wide">
                LYO VISION
              </span>
            </div>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
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

            {/* CTA button - desktop */}
            <a
              href="https://note.com/ando_lyo_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-primary/50 text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/10 transition-all"
            >
              note
            </a>

            {/* Hamburger - mobile/tablet only */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex lg:hidden flex-col gap-1.5 w-7 cursor-pointer"
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

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`font-serif text-3xl sm:text-4xl transition-colors tracking-wide ${
                    activeSection === link.href.slice(1)
                      ? "text-primary"
                      : "text-white hover:text-primary"
                  }`}
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
