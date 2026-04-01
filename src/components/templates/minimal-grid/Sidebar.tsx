"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "X (Twitter)", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "note", href: "#" },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)] md:hidden">
        <a href="#" className="block">
          <h1
            className="text-lg tracking-wider"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Your Name
          </h1>
        </a>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
          className="p-1"
          style={{ color: "var(--color-text)" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--color-surface)] md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg tracking-widest uppercase text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 border-t border-[var(--color-border)] pt-6 flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex-col justify-between z-50"
      >
        {/* Logo / Name */}
        <div className="px-8 pt-12">
          <a href="#" className="block">
            <h1
              className="text-xl tracking-wider"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Your Name
            </h1>
            <p className="text-[10px] tracking-[0.3em] text-[var(--color-text-muted)] mt-1 uppercase">
              Designer / Creator
            </p>
          </a>
        </div>

        {/* Navigation */}
        <nav className="px-8">
          <ul className="space-y-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="group relative text-sm tracking-widest uppercase text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Links */}
        <div className="px-8 pb-10">
          <div className="border-t border-[var(--color-border)] pt-6">
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[11px] tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
