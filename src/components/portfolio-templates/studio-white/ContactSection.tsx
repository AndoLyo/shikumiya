"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";
import { buildSnsLinks } from "@/lib/site-data";

const STYLE = `
  .sw-contact-link {
    transition: color 0.2s ease;
  }
  .sw-contact-link:hover {
    color: var(--sw-accent) !important;
  }
  .sw-social-item {
    transition: all 0.2s ease;
  }
  .sw-social-item:hover {
    border-color: var(--sw-accent) !important;
  }
  .sw-social-item:hover span {
    color: var(--sw-accent) !important;
  }
`;

const socialLinks = [
  { label: "X / Twitter", href: "https://x.com/", handle: "@yourname" },
  { label: "Instagram", href: "https://instagram.com/", handle: "@yourname" },
  { label: "note", href: "https://note.com/", handle: "Your Name" },
];

export function ContactSection() {
  const data = useSiteData();
  const email = data?.email || "hello@example.com";
  const artistName = data?.artistName || "Your Name";

  return (
    <section
      id="contact"
      style={{
        padding: "80px 60px",
        borderTop: "1px solid var(--sw-border)",
      }}
    >
      <style>{STYLE}</style>

      <motion.div
        className="max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Section label */}
        <p
          className="text-xs tracking-[0.35em] uppercase mb-8"
          style={{ color: "var(--sw-text-muted)" }}
        >
          Contact
        </p>

        {/* Divider */}
        <div
          className="mb-8"
          style={{
            width: "40px",
            height: "1px",
            background: "var(--sw-accent)",
          }}
        />

        {/* Email */}
        <div style={{ marginBottom: "32px" }}>
          <a
            href={`mailto:${email}`}
            className="sw-contact-link flex items-center gap-3"
            style={{
              color: "var(--sw-text)",
              textDecoration: "none",
              fontSize: "14px",
              letterSpacing: "0.05em",
              fontWeight: 300,
            }}
          >
            <Mail size={15} style={{ color: "var(--sw-text-muted)", flexShrink: 0 }} />
            {email}
          </a>
        </div>

        {/* Social links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "48px" }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sw-social-item flex items-center justify-between"
              style={{
                textDecoration: "none",
                padding: "10px 14px",
                border: "1px solid var(--sw-border)",
                background: "var(--sw-surface)",
              }}
            >
              <span
                className="text-xs tracking-[0.15em]"
                style={{ color: "var(--sw-text)" }}
              >
                {link.label}
              </span>
              <span
                className="flex items-center gap-2"
                style={{ fontSize: "10px", color: "var(--sw-text-muted)" }}
              >
                {link.handle}
                <ExternalLink size={9} />
              </span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p
          className="text-xs"
          style={{
            color: "var(--sw-text-muted)",
            letterSpacing: "0.1em",
          }}
        >
          &copy; {new Date().getFullYear()} {artistName}. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
}
