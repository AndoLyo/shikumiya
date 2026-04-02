"use client";

import { useState, useEffect } from "react";
import { Heart, Menu, X } from "lucide-react";

const navItems = [
  { label: "Works", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-[0_2px_20px_rgba(255,126,179,0.12)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            <Heart className="h-4 w-4 fill-white text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-wide"
            style={{ color: "var(--color-text)" }}
          >
            pastel
            <span style={{ color: "var(--color-accent)" }}>pop</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium transition-colors duration-200 group"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span className="relative">
                {item.label}
                <span
                  className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              </span>
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-[0_4px_12px_rgba(255,126,179,0.4)]"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            お問い合わせ
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden items-center justify-center h-9 w-9 rounded-full transition-colors"
          style={{ color: "var(--color-text)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="fixed inset-0 top-[65px] z-40 flex flex-col px-8 py-8 md:hidden"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-5 text-xl font-semibold border-b"
              style={{
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-8 rounded-full px-6 py-3 text-center text-base font-semibold text-white"
            style={{ backgroundColor: "var(--color-accent)" }}
            onClick={() => setMobileOpen(false)}
          >
            お問い合わせ
          </a>
        </nav>
      )}
    </header>
  );
}
