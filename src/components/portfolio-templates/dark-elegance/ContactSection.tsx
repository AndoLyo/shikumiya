"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";
import type { SiteData } from "@/lib/site-data";

const STYLE = `
  .de-contact-section-link {
    transition: all 0.3s ease;
    border-bottom: 1px solid transparent;
  }
  .de-contact-section-link:hover {
    border-bottom-color: var(--de-gold);
    color: var(--de-gold) !important;
  }
  .de-contact-social-item {
    transition: all 0.3s ease;
  }
  .de-contact-social-item:hover {
    color: var(--de-gold) !important;
    border-color: var(--de-gold) !important;
    background: rgba(201,169,110,0.06) !important;
  }
`;

const defaultSocialLinks = [
  { label: "X / Twitter", href: "https://x.com/", handle: "@yourname" },
  { label: "Instagram", href: "https://instagram.com/", handle: "@yourname" },
  { label: "note", href: "https://note.com/", handle: "Your Name" },
];

function buildSocialLinks(data: SiteData) {
  const links: { label: string; href: string; handle: string }[] = [];
  if (data.snsX) links.push({ label: "X / Twitter", handle: data.snsX, href: data.snsX.startsWith("http") ? data.snsX : `https://x.com/${data.snsX.replace("@", "")}` });
  if (data.snsInstagram) links.push({ label: "Instagram", handle: data.snsInstagram, href: data.snsInstagram.startsWith("http") ? data.snsInstagram : `https://instagram.com/${data.snsInstagram.replace("@", "")}` });
  if (data.snsNote) links.push({ label: "note", handle: data.snsNote, href: data.snsNote.startsWith("http") ? data.snsNote : `https://note.com/${data.snsNote}` });
  if (data.snsPixiv) links.push({ label: "Pixiv", handle: data.snsPixiv, href: data.snsPixiv.startsWith("http") ? data.snsPixiv : `https://pixiv.net/users/${data.snsPixiv}` });
  if (data.snsOther) links.push({ label: "Other", handle: data.snsOther, href: data.snsOther.startsWith("http") ? data.snsOther : "#" });
  return links;
}

export function ContactSection() {
  const data = useSiteData();
  const email = data?.email || "hello@example.com";
  const artistName = data?.artistName || "Your Name";
  const socialLinks = data ? buildSocialLinks(data) : defaultSocialLinks;
  return (
    <section
      style={{
        padding: "80px 60px",
        background: "var(--de-bg)",
        borderTop: "1px solid var(--de-border)",
      }}
    >
      <style>{STYLE}</style>

      <motion.div
        className="max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            height: "1px",
            background: "linear-gradient(90deg, var(--de-gold), transparent)",
            transformOrigin: "left center",
            marginBottom: "32px",
            width: "80px",
          }}
        />

        {/* Eyebrow */}
        <p
          style={{
            fontSize: "9px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "var(--de-gold)",
            marginBottom: "16px",
          }}
        >
          Get in Touch
        </p>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "32px",
            fontStyle: "italic",
            color: "var(--de-text)",
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          Contact
        </h2>

        {/* Tagline */}
        <p
          style={{
            fontSize: "12px",
            color: "var(--de-text-muted)",
            marginBottom: "36px",
            lineHeight: 1.7,
          }}
        >
          お仕事のご依頼・ご相談はお気軽にご連絡ください。
        </p>

        {/* Gold divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, var(--de-gold), transparent)",
            marginBottom: "32px",
          }}
        />

        {/* Email */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.35em",
              color: "var(--de-text-muted)",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Email
          </div>
          <a
            href={`mailto:${email}`}
            className="de-contact-section-link flex items-center gap-3"
            style={{
              color: "var(--de-text)",
              textDecoration: "none",
              fontSize: "15px",
              letterSpacing: "0.05em",
              display: "inline-flex",
              paddingBottom: "4px",
            }}
          >
            <Mail size={15} style={{ color: "var(--de-gold)", flexShrink: 0 }} />
            {email}
          </a>
        </div>

        {/* Social links */}
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.35em",
              color: "var(--de-text-muted)",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            Social
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="de-contact-social-item flex items-center justify-between"
                style={{
                  color: "var(--de-text-muted)",
                  textDecoration: "none",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  border: "1px solid var(--de-border)",
                  padding: "10px 14px",
                }}
              >
                <span>{link.label}</span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--de-text-muted)",
                    opacity: 0.6,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {link.handle}
                  <ExternalLink size={9} />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: "center" }}>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, var(--de-gold), transparent)",
              transformOrigin: "center",
              marginBottom: "24px",
            }}
          />
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "var(--de-text-muted)",
            }}
          >
            &copy; {new Date().getFullYear()} {artistName}. All rights reserved.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
