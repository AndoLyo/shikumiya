"use client";

import { useState, useEffect } from "react";
import { Feather, Menu, X } from "lucide-react";

const navItems = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_2px_24px_rgba(143,191,160,0.12)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-10 py-5">
        {/* Logo with watercolor blob behind */}
        <a href="#" className="relative flex items-center gap-3 group">
          {/* SVG watercolor blob behind logo */}
          <span className="absolute -inset-2 -z-10 opacity-30 transition-opacity duration-300 group-hover:opacity-50">
            <svg viewBox="0 0 80 40" className="w-20 h-10" aria-hidden="true">
              <path
                d="M10,20 C10,8 20,4 38,5 C56,6 70,10 68,22 C66,34 54,38 36,36 C18,34 10,32 10,20 Z"
                fill="var(--wc-blue)"
              />
            </svg>
          </span>
          <Feather className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" style={{ color: "var(--wc-blue)" }} />
          <span
            className="text-lg font-semibold tracking-wide"
            style={{
              color: "var(--wc-text)",
              fontStyle: "italic",
              letterSpacing: "0.05em",
            }}
          >
            Mizuki
            <span className="not-italic font-light" style={{ color: "var(--wc-blue)" }}>
              .art
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-2 md:flex items-center">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/60"
              style={{ color: "var(--wc-text-muted)" }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_4px_16px_rgba(127,181,213,0.5)]"
            style={{ backgroundColor: "var(--wc-blue)" }}
          >
            お問い合わせ
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden items-center justify-center h-9 w-9 rounded-full transition-colors"
          style={{ color: "var(--wc-text)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="fixed inset-0 top-[73px] z-40 flex flex-col px-8 py-10 md:hidden"
          style={{ backgroundColor: "var(--wc-surface)" }}
        >
          {/* Decorative blob top right */}
          <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 opacity-10">
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <path
                d="M50,30 C80,10 130,20 160,60 C190,100 170,160 130,170 C90,180 30,150 20,110 C10,70 20,50 50,30Z"
                fill="var(--wc-pink)"
              />
            </svg>
          </div>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-5 text-xl font-medium border-b"
              style={{
                color: "var(--wc-text)",
                borderColor: "var(--wc-border)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-8 rounded-full px-6 py-3 text-center text-base font-semibold text-white"
            style={{ backgroundColor: "var(--wc-blue)" }}
            onClick={() => setMobileOpen(false)}
          >
            お問い合わせ
          </a>
        </nav>
      )}
    </header>
  );
}
