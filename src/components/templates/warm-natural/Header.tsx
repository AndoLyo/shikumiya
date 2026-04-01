"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "サービス", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "お問い合わせ", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <a
          href="#"
          className="text-lg sm:text-xl font-bold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          warm
          <span style={{ color: "var(--color-accent-gold)" }}>.</span>
          natural
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium transition-colors hover:text-[var(--color-accent-gold)]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="fixed inset-0 top-[60px] z-40 border-t border-[var(--color-border)] bg-white px-6 py-6 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-4 text-base font-medium border-b border-[var(--color-border)]/30"
              style={{ color: "var(--color-text)" }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
