"use client";

import { useSiteData } from "@/lib/SiteDataContext";

// Vermillion seal SVG for footer
function FooterSeal() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" stroke="var(--color-accent)" strokeWidth="1.5" fill="rgba(199,62,58,0.07)" />
      <circle cx="20" cy="20" r="14" stroke="var(--color-accent)" strokeWidth="0.6" fill="none" opacity="0.4" />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontSize="13"
        fontFamily="'Hiragino Mincho ProN', 'Yu Mincho', serif"
        fill="var(--color-accent)"
        fontWeight="700"
      >
        墨
      </text>
    </svg>
  );
}

export default function Footer() {
  const data = useSiteData();
  const artistName = data?.artistName || "Sumi Works";

  const year = new Date().getFullYear();

  return (
    <footer
      className="px-8 sm:px-12 pt-10 pb-8"
      style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: seal + site name */}
        <div className="flex items-center gap-4">
          <FooterSeal />
          <div>
            <p
              className="text-sm font-semibold tracking-[0.1em]"
              style={{ color: "var(--color-text)" }}
            >
              SUMI・WORKS
            </p>
            <p
              className="text-[10px] tracking-[0.2em] mt-0.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              墨絵アート ポートフォリオ
            </p>
          </div>
        </div>

        {/* Center: nav links */}
        <nav className="flex gap-8">
          {["作品", "紹介", "連絡"].map((label) => (
            <a
              key={label}
              href={`#${label === "作品" ? "works" : label === "紹介" ? "about" : "contact"}`}
              className="text-xs tracking-[0.2em] transition-opacity hover:opacity-50"
              style={{ color: "var(--color-text-muted)" }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right: copyright */}
        <p
          className="text-[11px] tracking-[0.1em]"
          style={{ color: "var(--color-text-muted)" }}
        >
          &copy; {year} {artistName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
