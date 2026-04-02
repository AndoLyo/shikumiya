"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STYLE = `
  .mb-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .mb-header--expanded {
    background: var(--mb-bg);
  }
  .mb-header--compact {
    background: var(--mb-surface);
    border-bottom: 1px solid var(--mb-border);
  }
  .mb-accent-bar {
    height: 4px;
    background: var(--mb-accent);
    width: 100%;
  }
  .mb-site-name {
    font-size: clamp(2.5rem, 8vw, 7rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 0.9;
    color: var(--mb-text);
    text-transform: uppercase;
    font-family: 'Arial Black', 'Arial', sans-serif;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .mb-site-name--compact {
    font-size: clamp(1.2rem, 3vw, 2rem);
  }
  .mb-nav {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  .mb-nav-link {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mb-text-muted);
    text-decoration: none;
    transition: color 0.2s;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .mb-nav-link:hover {
    color: var(--mb-accent);
  }
`;

const navItems = [
  { label: "Works", target: "works" },
  { label: "About", target: "about" },
  { label: "Contact", target: "contact" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Header() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{STYLE}</style>
      <header className={`mb-header ${compact ? "mb-header--compact" : "mb-header--expanded"}`}>
        {/* Vermillion accent bar always on top */}
        <div className="mb-accent-bar" />

        <div className="px-6 md:px-10 py-3 md:py-4">
          <div className="flex items-end justify-between gap-4">
            {/* Site name — oversized typographic */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className={`mb-site-name ${compact ? "mb-site-name--compact" : ""}`}
                aria-label="MOSAIC.BOLD"
              >
                MOSAIC<span style={{ color: "var(--mb-accent)" }}>.</span>BOLD
              </span>
            </motion.div>

            {/* Nav */}
            <motion.nav
              className="mb-nav pb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className="mb-nav-link"
                  onClick={() => scrollToSection(item.target)}
                >
                  {item.label}
                </button>
              ))}
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't hide behind fixed header (expanded state height) */}
      <div
        style={{
          height: compact ? "72px" : "auto",
          transition: "height 0.35s",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
