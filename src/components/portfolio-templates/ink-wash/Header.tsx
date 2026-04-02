"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "作品", href: "#works" },
  { label: "紹介", href: "#about" },
  { label: "連絡", href: "#contact" },
];

// Thin ink brush stroke SVG divider
function InkDivider() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      height="3"
      viewBox="0 0 1200 3"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 1.5 C100 0.5, 200 2.5, 350 1.5 C500 0.5, 600 2.2, 750 1.5 C900 0.8, 1050 2.0, 1200 1.5"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled
          ? "rgba(245, 240, 232, 0.96)"
          : "rgba(245, 240, 232, 0.0)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="relative mx-auto flex max-w-7xl items-center px-6 sm:px-10 py-5">
        {/* Vertical site name — left edge decorative element */}
        <div
          className="flex items-center gap-4 flex-1"
          style={{ color: "var(--color-text)" }}
        >
          {/* Vertical Japanese text (decorative) */}
          <span
            className="hidden sm:block text-xs tracking-[0.25em] select-none opacity-70"
            style={{
              writingMode: "vertical-rl",
              fontFamily: "inherit",
              letterSpacing: "0.3em",
              color: "var(--color-text-muted)",
              height: "52px",
            }}
          >
            墨絵
          </span>
          {/* Site name */}
          <a
            href="#"
            className="text-base sm:text-lg font-semibold tracking-[0.12em] transition-opacity hover:opacity-70"
            style={{ color: "var(--color-text)" }}
          >
            SUMI
            <span style={{ color: "var(--color-accent)" }}>・</span>
            WORKS
          </a>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm tracking-[0.15em] transition-colors group"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-400 group-hover:w-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </a>
          ))}
          <a
            href="#contact"
            className="text-xs tracking-[0.2em] px-5 py-2 border transition-colors duration-300 hover:opacity-80"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
          >
            お問い合わせ
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden transition-opacity hover:opacity-60"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
          style={{ color: "var(--color-text)" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Ink stroke divider */}
      <InkDivider />

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="fixed inset-0 top-[72px] z-40 flex flex-col px-8 py-10 md:hidden"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="py-5 text-2xl tracking-[0.15em] border-b"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
                animationDelay: `${i * 80}ms`,
              }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-8 self-start text-sm tracking-[0.2em] px-6 py-3 border"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
            onClick={() => setMobileOpen(false)}
          >
            お問い合わせ
          </a>
        </nav>
      )}
    </header>
  );
}
