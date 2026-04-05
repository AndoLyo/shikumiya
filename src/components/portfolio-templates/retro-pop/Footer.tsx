"use client";

import { useRef, useEffect } from "react";
import { Zap } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";

const footerLinks = [
  { label: "WORKS", href: "#works" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

const socialLinks = [
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "pixiv", href: "#" },
];

const marqueeText =
  "YUKI PORTFOLIO  ★  RETRO POP ART  ★  AI ILLUSTRATION  ★  CHARACTER DESIGN  ★  DIGITAL ART  ★  ";

export default function Footer() {
  const data = useSiteData();
  const artistName = data?.artistName || "RETRO POP";

  const marqueeRef = useRef<HTMLDivElement>(null);

  // Duplicate the marquee content for seamless loop
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    // CSS animation handles the loop — no JS needed
  }, []);

  return (
    <footer style={{ backgroundColor: "var(--rp-text)" }}>
      {/* Marquee scrolling text strip */}
      <div
        className="overflow-hidden py-3 border-b-2"
        style={{ backgroundColor: "var(--rp-orange)", borderColor: "var(--rp-border)" }}
      >
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap"
          style={{
            animation: "rp-marquee 18s linear infinite",
          }}
        >
          {/* Repeat text 3x for seamless loop */}
          {[0, 1, 2].map((rep) => (
            <span
              key={rep}
              className="text-xs font-black uppercase tracking-widest pr-0 text-white"
              aria-hidden={rep > 0}
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* CSS keyframe injected via style tag */}
      <style>{`
        @keyframes rp-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>

      {/* Footer content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top row: logo + nav */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div
              className="flex h-9 w-9 items-center justify-center border-2 rotate-12 group-hover:rotate-0 transition-transform duration-200"
              style={{
                backgroundColor: "var(--rp-orange)",
                borderColor: "var(--rp-yellow)",
              }}
            >
              <Zap className="h-4 w-4 fill-white text-white" />
            </div>
            <span className="text-lg font-black uppercase tracking-tight text-white">
              retro
              <span style={{ color: "var(--rp-orange)" }}>pop</span>
            </span>
          </a>

          {/* Nav */}
          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-black uppercase tracking-widest text-white/40 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mb-8 h-[2px]" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />

        {/* Bottom row: copyright + socials */}
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <p className="text-xs font-bold text-white/30 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} YUKI. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-3">
            {socialLinks.map((link, i) => {
              const colors = [
                { bg: "rgba(255,255,255,0.1)", active: "var(--rp-orange)" },
                { bg: "rgba(255,255,255,0.1)", active: "var(--rp-pink)" },
                { bg: "rgba(255,255,255,0.1)", active: "var(--rp-teal)" },
              ];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="w-9 h-9 border flex items-center justify-center text-[10px] font-black text-white/60 uppercase transition-all duration-150 hover:text-white hover:-translate-y-0.5"
                  style={{
                    backgroundColor: colors[i % colors.length].bg,
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  {link.label.slice(0, 1)}
                </a>
              );
            })}
          </div>
        </div>

        {/* Credit */}
        <div className="mt-6 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/20 uppercase tracking-widest">
            <Zap className="h-3 w-3" />
            MADE WITH RETRO ENERGY
          </p>
        </div>
      </div>
    </footer>
  );
}
