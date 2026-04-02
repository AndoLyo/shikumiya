"use client";

import { Feather } from "lucide-react";

const footerLinks = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "pixiv", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--wc-text)" }}>
      {/* Organic wavy top SVG divider — transitions from section above */}
      <div
        className="overflow-hidden leading-none"
        style={{ backgroundColor: "var(--wc-bg)" }}
      >
        <svg
          viewBox="0 0 1440 70"
          className="block w-full"
          preserveAspectRatio="none"
          height="70"
          aria-hidden="true"
          style={{ fill: "var(--wc-text)" }}
        >
          <path d="M0,30 C200,70 400,5 600,38 C800,70 1000,15 1200,45 C1320,62 1380,40 1440,35 L1440,70 L0,70 Z" />
        </svg>
      </div>

      {/* Footer content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Logo + nav row */}
        <div className="mb-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Feather className="h-4 w-4 text-white/60" />
            <span
              className="text-base font-medium italic text-white/80"
              style={{ letterSpacing: "0.05em" }}
            >
              Mizuki
              <span className="not-italic font-light" style={{ color: "var(--wc-blue)", opacity: 0.7 }}>
                .art
              </span>
            </span>
          </a>

          {/* Nav links */}
          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-white/40 transition-colors duration-200 hover:text-white/70"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Thin divider */}
        <div className="mb-8 h-px opacity-10 bg-white" />

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} Mizuki. All rights reserved.
          </p>

          {/* Social pills */}
          <div className="flex gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "rgba(127,181,213,0.18)",
                  color: "rgba(127,181,213,0.8)",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-6 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-white/25 italic">
            Painting softly, one drop at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
