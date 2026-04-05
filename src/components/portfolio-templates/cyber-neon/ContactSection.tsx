"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { useSiteData } from "@/lib/SiteDataContext";
import type { SiteData } from "@/lib/site-data";

const STYLE = `
  @keyframes cn-connect-flicker {
    0%, 95%, 100% { opacity: 1; }
    96%, 98% { opacity: 0.4; }
    97% { opacity: 0.8; }
  }
  .cn-connect-text {
    animation: cn-connect-flicker 5s ease-in-out infinite;
  }
  @keyframes cn-mesh-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .cn-mesh-bg {
    background: radial-gradient(ellipse at 20% 50%, rgba(255,0,229,0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 50%, rgba(0,240,255,0.10) 0%, transparent 60%),
                radial-gradient(ellipse at 50% 80%, rgba(191,255,0,0.06) 0%, transparent 60%);
    background-size: 200% 200%;
    animation: cn-mesh-shift 8s ease-in-out infinite;
  }
  @keyframes cn-social-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,240,255,0); }
    50% { box-shadow: 0 0 0 4px rgba(0,240,255,0.08); }
  }
  .cn-social-btn:hover {
    animation: cn-social-pulse 1.2s ease-in-out infinite;
  }
`;

const defaultSocialLinks = [
  { label: "X / Twitter", href: "https://x.com/" },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "note", href: "https://note.com/" },
  { label: "Pixiv", href: "https://pixiv.net/" },
];

function buildSocialLinks(data: SiteData) {
  const links: { label: string; href: string }[] = [];
  if (data.snsX) links.push({ label: "X / Twitter", href: data.snsX.startsWith("http") ? data.snsX : `https://x.com/${data.snsX.replace("@", "")}` });
  if (data.snsInstagram) links.push({ label: "Instagram", href: data.snsInstagram.startsWith("http") ? data.snsInstagram : `https://instagram.com/${data.snsInstagram.replace("@", "")}` });
  if (data.snsPixiv) links.push({ label: "Pixiv", href: data.snsPixiv.startsWith("http") ? data.snsPixiv : `https://pixiv.net/users/${data.snsPixiv}` });
  if (data.snsNote) links.push({ label: "note", href: data.snsNote.startsWith("http") ? data.snsNote : `https://note.com/${data.snsNote}` });
  if (data.snsOther) links.push({ label: "Other", href: data.snsOther.startsWith("http") ? data.snsOther : "#" });
  return links;
}

export function ContactSection() {
  const data = useSiteData();
  const email = data?.email || "hello@example.com";
  const artistName = data?.artistName || "CYBER.EXE";
  const socialLinks = data ? buildSocialLinks(data) : defaultSocialLinks;

  return (
    <section
      id="contact"
      className="tpl-snap-section cn-mesh-bg"
      style={{ background: "var(--cn-bg)" }}
    >
      <style>{STYLE}</style>

      {/* Background grid (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Section label */}
      <div
        className="absolute top-6 left-8 z-20 font-mono text-xs tracking-[0.4em] uppercase"
        style={{ color: "var(--cn-cyan)", textShadow: "0 0 8px var(--cn-cyan)" }}
      >
        // 04_CONNECT
      </div>

      {/* Corner frame accents */}
      {[
        "top-4 left-4",
        "top-4 right-4 rotate-90",
        "bottom-4 left-4 -rotate-90",
        "bottom-4 right-4 rotate-180",
      ].map((pos, i) => (
        <svg key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none opacity-40`} viewBox="0 0 32 32" fill="none">
          <path d="M0 16 L0 0 L16 0" stroke="var(--cn-magenta)" strokeWidth="1" />
        </svg>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 gap-8">
        {/* Big CONNECT sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="cn-connect-text text-5xl sm:text-7xl md:text-9xl font-black tracking-tight uppercase"
            style={{
              fontFamily: "'Courier New', monospace",
              color: "var(--cn-cyan)",
              textShadow:
                "0 0 20px var(--cn-cyan), 0 0 50px var(--cn-cyan), 0 0 100px rgba(0,240,255,0.4)",
            }}
          >
            CONNECT
          </h2>
          <div
            className="mt-2 h-px mx-auto"
            style={{
              width: "60%",
              background:
                "linear-gradient(90deg, transparent, var(--cn-magenta), var(--cn-cyan), transparent)",
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="font-mono text-sm tracking-[0.25em] uppercase"
          style={{ color: "var(--cn-text-muted)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          仕事の依頼・コラボ・質問、何でも歓迎
        </motion.p>

        {/* Email */}
        <motion.a
          href={`mailto:${email}`}
          className="group flex items-center gap-3 font-mono text-base sm:text-lg tracking-wider transition-all duration-300"
          style={{ color: "var(--cn-text)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ color: "var(--cn-cyan)" }}
        >
          <Mail
            size={20}
            className="transition-all duration-300 group-hover:scale-110"
            style={{
              color: "var(--cn-cyan)",
              filter: "drop-shadow(0 0 6px var(--cn-cyan))",
            }}
          />
          <span
            className="transition-all duration-300"
            style={{
              borderBottom: "1px solid transparent",
              paddingBottom: "2px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor = "var(--cn-cyan)";
              (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px var(--cn-cyan)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent";
              (e.currentTarget as HTMLElement).style.textShadow = "none";
            }}
          >
            {email}
          </span>
        </motion.a>

        {/* Social links */}
        {socialLinks.length > 0 && <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cn-social-btn group flex items-center gap-2 px-5 py-2.5 font-mono text-xs tracking-[0.25em] uppercase transition-all duration-300 rounded-none"
              style={{
                border: "1px solid var(--cn-border)",
                color: "var(--cn-text-muted)",
                background: "rgba(0,240,255,0.03)",
              }}
              whileHover={{
                color: "var(--cn-cyan)",
                borderColor: "var(--cn-cyan)",
                background: "rgba(0,240,255,0.08)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{link.label}</span>
              <ExternalLink
                size={12}
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </motion.a>
          ))}
        </motion.div>}

        {/* Footer credit */}
        <motion.p
          className="absolute bottom-6 font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "var(--cn-text-muted)", opacity: 0.4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          &copy; {new Date().getFullYear()} {artistName} — All Rights Reserved
        </motion.p>
      </div>
    </section>
  );
}
