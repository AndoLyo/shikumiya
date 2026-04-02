"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "テンプレート", href: "#showcase" },
  { label: "料金", href: "#pricing" },
  { label: "よくある質問", href: "#faq" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks
        .filter((l) => l.href.startsWith("#"))
        .map((l) => l.href.slice(1));
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-[#0a0a0f] focus:rounded-lg focus:text-sm"
      >
        メインコンテンツにスキップ
      </a>
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
              <span className="font-serif text-sm font-bold text-white tracking-wide">
                しくみや
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-text-secondary group-hover:text-primary transition-colors">
                by Lyo Vision
              </span>
            </div>
          </a>

          <div className="flex items-center gap-4">
            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isPage = link.href.startsWith("/");
                if (isPage) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-3 py-1.5 text-[12px] tracking-wider text-text-secondary hover:text-white transition-all"
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className={`px-3 py-1.5 text-[12px] tracking-wider transition-all ${
                      activeSection === link.href.slice(1)
                        ? "text-primary"
                        : "text-text-secondary hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, "#contact")}
              className="hidden md:flex items-center px-4 py-1.5 border border-primary/50 text-primary text-xs tracking-widest hover:bg-primary/10 transition-all"
            >
              お問い合わせ
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex lg:hidden flex-col gap-1.5 w-7 cursor-pointer"
              aria-label="メニューを開く"
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
            transition={{ duration: 0.4 }}
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => {
                const isPage = link.href.startsWith("/");
                const cls = `font-serif text-3xl sm:text-4xl tracking-wide ${
                  !isPage && activeSection === link.href.slice(1)
                    ? "text-primary"
                    : "text-white hover:text-primary"
                } transition-colors`;
                const mp = {
                  initial: { opacity: 0, y: 20 } as const,
                  animate: { opacity: 1, y: 0 } as const,
                  exit: { opacity: 0, y: -10 } as const,
                  transition: { duration: 0.3, delay: i * 0.05 },
                };
                return isPage ? (
                  <motion.div key={link.href} {...mp}>
                    <Link href={link.href} className={cls} onClick={() => setIsOpen(false)}>
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className={cls} {...mp}>
                    {link.label}
                  </motion.a>
                );
              })}
              {/* Contact in mobile menu */}
              <motion.a
                href="#contact"
                onClick={(e) => scrollTo(e, "#contact")}
                className="mt-4 px-8 py-3 border border-primary/50 text-primary text-sm tracking-widest hover:bg-primary/10 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
              >
                お問い合わせ
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
