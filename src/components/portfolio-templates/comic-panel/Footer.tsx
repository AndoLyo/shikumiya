"use client";

import { AtSign, Camera, Globe } from "lucide-react";

const socialLinks = [
  { icon: AtSign, href: "#", label: "Twitter" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Globe, href: "#", label: "Website" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--cp-border)", // #1A1A1A — pure dark
        borderTop: "4px solid var(--cp-border)",
      }}
    >
      {/* Halftone dot pattern on dark bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 py-14">
        {/* THE END — comic style */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="relative px-10 py-5 text-center"
            style={{
              border: "4px solid rgba(255,255,255,0.15)",
              borderRadius: "2px",
            }}
          >
            {/* Corner marks like a manga page end */}
            <span
              className="absolute top-1 left-1 w-4 h-4"
              style={{
                borderTop: "2px solid var(--cp-yellow)",
                borderLeft: "2px solid var(--cp-yellow)",
              }}
            />
            <span
              className="absolute top-1 right-1 w-4 h-4"
              style={{
                borderTop: "2px solid var(--cp-yellow)",
                borderRight: "2px solid var(--cp-yellow)",
              }}
            />
            <span
              className="absolute bottom-1 left-1 w-4 h-4"
              style={{
                borderBottom: "2px solid var(--cp-yellow)",
                borderLeft: "2px solid var(--cp-yellow)",
              }}
            />
            <span
              className="absolute bottom-1 right-1 w-4 h-4"
              style={{
                borderBottom: "2px solid var(--cp-yellow)",
                borderRight: "2px solid var(--cp-yellow)",
              }}
            />

            <p
              className="text-4xl font-black uppercase italic md:text-5xl tracking-tight"
              style={{
                color: "#ffffff",
                WebkitTextStroke: "2px rgba(255,255,255,0.3)",
                textShadow: "3px 3px 0 rgba(255,193,7,0.4)",
                letterSpacing: "-0.02em",
              }}
            >
              THE END
            </p>
            <div
              className="mt-2 h-[2px] w-full"
              style={{
                background: "linear-gradient(90deg, transparent, var(--cp-yellow), transparent)",
              }}
            />
            <p
              className="mt-2 text-xs font-black uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              — YUKI COMICS PORTFOLIO —
            </p>
          </div>
        </div>

        {/* Social links — manga panel icons */}
        <div className="flex justify-center gap-4 mb-10">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="group flex w-12 h-12 items-center justify-center transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{
                  border: "2.5px solid rgba(255,255,255,0.3)",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  boxShadow: "3px 3px 0 rgba(255,255,255,0.1)",
                  borderRadius: "0px",
                }}
              >
                <Icon
                  size={18}
                  className="transition-colors duration-150 group-hover:text-yellow-400"
                  color="rgba(255,255,255,0.7)"
                />
              </a>
            );
          })}
        </div>

        {/* Divider */}
        <div
          className="w-full mb-6"
          style={{ height: "2px", backgroundColor: "rgba(255,255,255,0.1)" }}
        />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo text */}
          <span
            className="text-sm font-black uppercase tracking-wider"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            YUKI<span style={{ color: "var(--cp-yellow)" }}>COMICS</span>
          </span>

          {/* Nav links */}
          <nav className="flex gap-6">
            {["Works", "About", "Contact"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-xs font-black uppercase tracking-wider transition-colors duration-150 hover:text-white"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p
            className="text-xs font-bold"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            © 2024 YUKI Comics. All rights reserved.
          </p>
        </div>

        {/* Manga page number style */}
        <div className="absolute bottom-3 right-6 flex items-center gap-2">
          <div
            className="w-6 h-[2px]"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          />
          <span
            className="text-xs font-black"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            END
          </span>
          <div
            className="w-6 h-[2px]"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          />
        </div>
      </div>
    </footer>
  );
}
