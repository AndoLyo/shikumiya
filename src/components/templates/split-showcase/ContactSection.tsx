"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
      ease: "easeOut" as const,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Behance", href: "#" },
  { label: "Vimeo", href: "#" },
];

export function ContactSection() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <motion.div
        className="text-center max-w-lg"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.h2
          variants={childVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
          style={{ color: "var(--color-text)" }}
        >
          お問い合わせ
        </motion.h2>

        {/* Gold line */}
        <motion.div
          variants={childVariants}
          className="h-[1px] w-16 mx-auto mb-10"
          style={{ backgroundColor: "var(--color-accent)" }}
        />

        {/* Email */}
        <motion.a
          variants={childVariants}
          href="mailto:hello@example.com"
          className="inline-flex items-center gap-3 font-mono text-sm mb-12 transition-opacity hover:opacity-70"
          style={{ color: "var(--color-accent)", letterSpacing: "0.1em" }}
        >
          <Mail size={16} />
          hello@example.com
        </motion.a>

        {/* Social links with gold dot separators */}
        <motion.div
          variants={childVariants}
          className="flex items-center justify-center gap-4 mb-16"
        >
          {socials.map((social, i) => (
            <span key={social.label} className="flex items-center gap-4">
              {i > 0 && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)", opacity: 0.5 }}
                />
              )}
              <a
                href={social.href}
                className="text-xs font-mono uppercase transition-opacity hover:opacity-70"
                style={{
                  color: "var(--color-text)",
                  letterSpacing: "0.15em",
                  opacity: 0.7,
                }}
              >
                {social.label}
              </a>
            </span>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.p
          variants={childVariants}
          className="text-xs font-mono"
          style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}
        >
          &copy; {new Date().getFullYear()} Your Name. All rights reserved.
        </motion.p>
      </motion.div>
    </section>
  );
}
