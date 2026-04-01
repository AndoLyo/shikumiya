"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";

const socialLinks = [
  { label: "X", href: "https://x.com/" },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "note", href: "https://note.com/" },
];

export function ContactSection() {
  return (
    <section
      className="tpl-snap-section"
      style={{
        background: "linear-gradient(180deg, #0a0a1a 0%, #0d0d24 50%, #0a0a1a 100%)",
      }}
    >
      <div className="flex flex-col items-center text-center px-6">
        {/* Heading */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.3em]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            CONTACT
          </h2>
          <div className="tpl-ornament-line mt-4" />
        </motion.div>

        {/* Email */}
        <motion.a
          href="mailto:hello@example.com"
          className="inline-flex items-center gap-3 text-lg tracking-wider transition-colors duration-300 mb-12 group"
          style={{ color: "var(--color-text-muted)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ color: "var(--color-accent-cyan)" }}
        >
          <Mail size={20} />
          <span className="group-hover:text-[var(--color-accent-cyan)]">
            hello@example.com
          </span>
        </motion.a>

        {/* Social links */}
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 rounded-full border transition-all duration-300 hover:border-transparent flex items-center gap-2 text-sm tracking-widest uppercase"
              style={{
                borderColor: "var(--color-text-muted)",
                color: "var(--color-text-muted)",
              }}
            >
              {/* Gradient border on hover */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-pink))",
                  padding: "1px",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              <span className="relative z-10 group-hover:text-[var(--color-text)] transition-colors duration-300">
                {link.label}
              </span>
              <ExternalLink
                size={14}
                className="relative z-10 group-hover:text-[var(--color-accent-cyan)] transition-colors duration-300"
              />
            </a>
          ))}
        </motion.div>

        {/* Footer credit */}
        <motion.p
          className="mt-16 text-xs tracking-wider"
          style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          &copy; 2025 Your Name. All rights reserved.
        </motion.p>
      </div>
    </section>
  );
}
