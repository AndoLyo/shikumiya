"use client";

import { Heart } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";

const footerLinks = [
  { label: "Works", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "pixiv", href: "#" },
];

export default function Footer() {
  const data = useSiteData();
  const artistName = data?.artistName || "Hana";

  return (
    <footer style={{ backgroundColor: "var(--color-text)" }}>
      {/* Wavy top divider */}
      <div className="overflow-hidden leading-none" style={{ backgroundColor: "var(--color-surface)" }}>
        <svg
          viewBox="0 0 1440 60"
          className="block w-full"
          preserveAspectRatio="none"
          height="60"
          aria-hidden="true"
          style={{ fill: "var(--color-text)" }}
        >
          <path d="M0,20 C360,60 720,0 1080,40 C1260,60 1380,30 1440,20 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* Footer content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Logo row */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <Heart className="h-4 w-4 fill-white text-white" />
            </div>
            <span className="text-base font-bold text-white/90">
              pastel
              <span style={{ color: "var(--color-accent)" }}>pop</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-white/50 transition-colors duration-200 hover:text-white/80"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px opacity-10" style={{ backgroundColor: "#ffffff" }} />

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {artistName}. All rights reserved.
          </p>

          {/* Social */}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "rgba(255,126,179,0.25)",
                  color: "var(--color-accent)",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Made with love */}
        <div className="mt-6 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-white/30">
            Made with
            <Heart className="h-3 w-3 fill-pink-400 text-pink-400" />
            by Hana
          </p>
        </div>
      </div>
    </footer>
  );
}
