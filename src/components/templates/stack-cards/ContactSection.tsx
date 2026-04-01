"use client";

import { motion } from "framer-motion";
import { Mail, Globe, ArrowUpRight, Send } from "lucide-react";

const socialLinks = [
  { icon: Globe, label: "Website", href: "#" },
  { icon: Send, label: "Contact", href: "#" },
  { icon: ArrowUpRight, label: "Portfolio", href: "#" },
];

export function ContactSection() {
  return (
    <section className="py-32 px-4" style={{ backgroundColor: "#0c0c0c" }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-8"
            style={{ color: "#e8e8e8" }}
          >
            一緒に作ろう
          </h2>

          <div
            className="mx-auto mb-10"
            style={{ width: 60, height: 1, backgroundColor: "#6366f1" }}
          />

          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-3 text-lg font-mono transition-colors duration-300 hover:opacity-80"
            style={{ color: "#6366f1" }}
          >
            <Mail size={20} />
            hello@example.com
          </a>

          <div className="flex items-center justify-center gap-6 mt-10">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="transition-colors duration-300 hover:opacity-80"
                style={{ color: "#555555" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>

          <div
            className="mt-24 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p
              className="text-xs font-mono tracking-widest"
              style={{ color: "#555555" }}
            >
              &copy; 2025 Your Name. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
