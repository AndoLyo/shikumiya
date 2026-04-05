"use client";

import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "./SiteDataContext";

const navItems = [
  { label: "WORKS", href: "#works" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  const data = useSiteData();
  const artistName = data?.artistName || "MANGA";
  const artistNameAccent = data ? "" : "PORT";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: scrolled ? "var(--cp-bg)" : "var(--cp-bg)",
        borderBottom: "3px solid var(--cp-border)",
        boxShadow: scrolled ? "0 4px 0 var(--cp-border)" : "none",
        backgroundImage: `radial-gradient(circle, var(--cp-border) 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Halftone overlay wash so text is legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgba(255,254,245,0.88)" }}
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8 py-3">
        {/* Logo — speech bubble shape via clip */}
        <a href="#" className="flex items-center gap-3 group">
          <div
            className="relative flex items-center justify-center px-4 py-2 transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-2"
            style={{
              backgroundColor: "var(--cp-yellow)",
              border: "2.5px solid var(--cp-border)",
              borderRadius: "8px 8px 8px 0px",
              boxShadow: "3px 3px 0 var(--cp-border)",
            }}
          >
            <Zap className="h-4 w-4 mr-1" style={{ color: "var(--cp-border)" }} />
            <span
              className="text-lg font-black tracking-tight uppercase"
              style={{ color: "var(--cp-text)", letterSpacing: "-0.02em" }}
            >
              {artistName}<span style={{ color: "var(--cp-red)" }}>{artistNameAccent}</span>
            </span>
            {/* Speech bubble tail */}
            <span
              className="absolute -bottom-[11px] left-3"
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderTop: "10px solid var(--cp-border)",
                display: "block",
              }}
            />
            <span
              className="absolute -bottom-[8px] left-[13px]"
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderTop: "8px solid var(--cp-yellow)",
                display: "block",
              }}
            />
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-sm font-black uppercase tracking-wider transition-all duration-150 hover:scale-105 hover:-rotate-1"
              style={{ color: "var(--cp-text)" }}
            >
              <span className="relative z-10">{item.label}</span>
              <span
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-150"
                style={{
                  backgroundColor: "var(--cp-yellow)",
                  border: "2px solid var(--cp-border)",
                  borderRadius: "4px",
                  boxShadow: "2px 2px 0 var(--cp-border)",
                }}
              />
            </a>
          ))}
          <a
            href="#contact"
            className="ml-4 px-6 py-2 text-sm font-black uppercase tracking-wider text-white transition-all duration-150 hover:scale-105 hover:-rotate-1"
            style={{
              backgroundColor: "var(--cp-red)",
              border: "2.5px solid var(--cp-border)",
              borderRadius: "4px",
              boxShadow: "3px 3px 0 var(--cp-border)",
            }}
          >
            お問い合わせ！
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden items-center justify-center h-10 w-10 transition-transform hover:scale-110"
          style={{
            backgroundColor: "var(--cp-yellow)",
            border: "2.5px solid var(--cp-border)",
            borderRadius: "4px",
            boxShadow: "2px 2px 0 var(--cp-border)",
            color: "var(--cp-text)",
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニュー"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="fixed inset-0 top-[63px] z-40 flex flex-col px-8 py-10 md:hidden"
            style={{
              backgroundColor: "var(--cp-bg)",
              borderTop: "3px solid var(--cp-border)",
              backgroundImage: `radial-gradient(circle, rgba(26,26,26,0.08) 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="block py-5 text-2xl font-black uppercase tracking-wider"
                style={{
                  color: "var(--cp-text)",
                  borderBottom: "2px solid var(--cp-border)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setMobileOpen(false)}
              >
                <span
                  className="inline-block px-2"
                  style={{ backgroundColor: i % 2 === 0 ? "var(--cp-yellow)" : "transparent" }}
                >
                  {item.label}
                </span>
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              className="mt-8 px-6 py-4 text-center text-lg font-black uppercase tracking-wider text-white"
              style={{
                backgroundColor: "var(--cp-red)",
                border: "2.5px solid var(--cp-border)",
                borderRadius: "4px",
                boxShadow: "4px 4px 0 var(--cp-border)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={() => setMobileOpen(false)}
            >
              CONTACT！
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
