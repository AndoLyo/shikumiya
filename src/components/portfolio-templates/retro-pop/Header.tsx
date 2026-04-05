"use client";

import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";

const navColors = ["var(--rp-orange)", "var(--rp-teal)", "var(--rp-pink)", "var(--rp-yellow)"];

const navItems = [
  { label: "WORKS", href: "#works" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  const data = useSiteData();
  const artistName = data?.artistName || "RETRO";

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
        backgroundColor: "var(--rp-bg)",
        borderBottom: scrolled ? "3px solid var(--rp-border)" : "3px solid transparent",
        boxShadow: scrolled ? "0 4px 0 var(--rp-yellow)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div
            className="flex h-10 w-10 items-center justify-center border-2 rotate-12 group-hover:rotate-0 transition-transform duration-200"
            style={{
              backgroundColor: "var(--rp-orange)",
              borderColor: "var(--rp-border)",
            }}
          >
            <Zap className="h-5 w-5 fill-white text-white" />
          </div>
          <span
            className="text-xl font-black tracking-tight uppercase"
            style={{ color: "var(--rp-text)" }}
          >
            retro
            <span
              className="inline-block px-1 ml-0.5"
              style={{
                backgroundColor: "var(--rp-pink)",
                color: "#fff",
                transform: "skewX(-6deg)",
                display: "inline-block",
              }}
            >
              pop
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden gap-8 md:flex items-center">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-black uppercase tracking-widest transition-colors duration-200 group"
              style={{ color: "var(--rp-text)" }}
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 h-[3px] w-full transition-transform duration-200 origin-left scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: navColors[i % navColors.length] }}
              />
            </a>
          ))}
          <a
            href="#contact"
            className="px-5 py-2 text-sm font-black uppercase tracking-wider text-white border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A2E]"
            style={{
              backgroundColor: "var(--rp-orange)",
              borderColor: "var(--rp-border)",
            }}
          >
            GET IN TOUCH
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden items-center justify-center h-10 w-10 border-2 transition-colors"
          style={{
            color: "var(--rp-text)",
            borderColor: "var(--rp-border)",
            backgroundColor: mobileOpen ? "var(--rp-yellow)" : "transparent",
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニューを開く"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="fixed inset-0 top-[67px] z-40 flex flex-col px-8 py-8 md:hidden border-t-3"
          style={{
            backgroundColor: "var(--rp-bg)",
            borderTop: "3px solid var(--rp-border)",
          }}
        >
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-5 text-2xl font-black uppercase tracking-widest border-b-2"
              style={{
                color: navColors[i % navColors.length],
                borderColor: "var(--rp-border)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-8 px-6 py-4 text-center text-base font-black uppercase tracking-widest text-white border-2"
            style={{
              backgroundColor: "var(--rp-orange)",
              borderColor: "var(--rp-border)",
            }}
            onClick={() => setMobileOpen(false)}
          >
            GET IN TOUCH
          </a>
        </nav>
      )}
    </header>
  );
}
