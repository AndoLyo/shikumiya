"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  .mb-footer {
    background: var(--mb-text);
    color: var(--mb-bg);
    padding: 3rem clamp(2rem, 6vw, 5rem) 2rem;
    position: relative;
    overflow: hidden;
    border-top: 4px solid var(--mb-accent);
  }
  .mb-footer-year {
    font-family: 'Arial Black', 'Arial', sans-serif;
    font-weight: 900;
    font-size: clamp(4rem, 16vw, 12rem);
    letter-spacing: -0.05em;
    color: rgba(245,245,245,0.05);
    line-height: 0.85;
    pointer-events: none;
    user-select: none;
    position: absolute;
    bottom: -0.1em;
    right: -0.03em;
    white-space: nowrap;
  }
  .mb-footer-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .mb-footer-brand {
    font-family: 'Arial Black', 'Arial', sans-serif;
    font-weight: 900;
    font-size: clamp(1.5rem, 5vw, 3.5rem);
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--mb-bg);
    line-height: 0.9;
  }
  .mb-footer-accent {
    color: var(--mb-accent);
  }
  .mb-footer-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
  .mb-footer-copy {
    font-family: 'Courier New', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(245,245,245,0.35);
  }
  .mb-footer-links {
    display: flex;
    gap: 1.5rem;
  }
  .mb-footer-link {
    font-family: 'Courier New', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(245,245,245,0.4);
    text-decoration: none;
    transition: color 0.2s;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .mb-footer-link:hover {
    color: var(--mb-accent);
  }
  .mb-footer-tagline {
    display: block;
    font-family: 'Courier New', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(245,245,245,0.25);
    margin-top: 0.3rem;
  }
`;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const footerLinks = [
  { label: "Works", target: "works" },
  { label: "About", target: "about" },
  { label: "Contact", target: "contact" },
];

export function Footer() {
  const data = useSiteData();
  const artistName = data?.artistName || "BOLD";

  return (
    <footer className="mb-footer">
      <style>{STYLE}</style>

      {/* Decorative large year */}
      <div className="mb-footer-year" aria-hidden>2025</div>

      <div className="mb-footer-content">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-footer-brand">
            MOSAIC<span className="mb-footer-accent">.</span>BOLD
          </div>
          <span className="mb-footer-tagline">AIアートポートフォリオ</span>
        </motion.div>

        {/* Meta */}
        <motion.div
          className="mb-footer-meta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mb-footer-links">
            {footerLinks.map((link) => (
              <button
                key={link.label}
                className="mb-footer-link"
                onClick={() => scrollToSection(link.target)}
              >
                {link.label}
              </button>
            ))}
          </div>
          <span className="mb-footer-copy">
            &copy; 2025 MOSAIC.BOLD — All Rights Reserved
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
