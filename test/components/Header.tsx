"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Solution", href: "#solution" },
  { label: "Product", href: "#product" },
  { label: "Membership", href: "#membership" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "#about" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-[#0a0a0f] focus:rounded-lg focus:text-sm focus:font-mono"
      >
        メインコンテンツにスキップ
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-[68px] flex items-center justify-between">
          {/* Logo - hiraomakoto style red dot accent + moufdesign clean logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group"
            data-cursor="pointer"
          >
            {/* Accent dot inspired by hiraomakoto's red circle */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-[15px] font-bold text-white tracking-wide">
                しくみや
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-text-secondary group-hover:text-primary transition-colors duration-300">
                by Lyo Vision
              </span>
            </div>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-5">
            {/* Desktop nav - Anthropic Learn clean style */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className="relative px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-all group"
                    data-cursor="pointer"
                  >
                    <span
                      className={
                        isActive
                          ? "text-primary"
                          : "text-text-secondary group-hover:text-white transition-colors"
                      }
                    >
                      {link.label}
                    </span>
                    {/* Underline animation (Anthropic Learn inspired) */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 h-px bg-primary"
                      initial={false}
                      animate={{
                        width: isActive ? "60%" : "0%",
                        x: "-50%",
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                );
              })}
            </nav>

            {/* CTA button - Anthropic Learn filled style */}
            <a
              href="https://note.com/ando_lyo_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-5 py-2 bg-primary text-[#0a0a0f] rounded-lg font-mono text-[11px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              data-cursor="pointer"
            >
              note
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6H10M10 6L7 3M10 6L7 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Hamburger - moufdesign style clean lines */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex lg:hidden flex-col gap-[6px] w-7 cursor-pointer p-1"
              aria-label="Toggle menu"
              data-cursor="pointer"
            >
              <motion.span
                className="block h-px bg-white origin-center w-full"
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block h-px bg-white w-full"
                animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px bg-white origin-center w-full"
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay - hiraomakoto mask transition style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Backdrop with geometric decorations (moufdesign inspired) */}
            <div className="absolute inset-0 bg-[#0a0a0f]/98 backdrop-blur-2xl">
              {/* Decorative geometric shapes */}
              <div className="absolute top-[10%] right-[15%] w-32 h-32 border border-primary/5 rotate-45" />
              <div className="absolute bottom-[15%] left-[10%] w-24 h-24 rounded-full border border-gold/5" />
              <div className="absolute top-[60%] right-[8%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-primary/5" />
            </div>

            <nav className="relative z-10 flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`font-serif text-4xl sm:text-5xl tracking-wide transition-colors ${
                    activeSection === link.href.slice(1)
                      ? "text-primary"
                      : "text-white hover:text-primary"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  data-cursor="pointer"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Social links in menu */}
              <motion.div
                className="flex items-center gap-6 mt-6 font-mono text-xs text-text-muted tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href="https://x.com/ando_lyo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  X
                </a>
                <span className="w-1 h-1 rounded-full bg-primary/30" />
                <a
                  href="https://github.com/ando-lyo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
                <span className="w-1 h-1 rounded-full bg-primary/30" />
                <a
                  href="https://www.instagram.com/ando_lyo_ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
