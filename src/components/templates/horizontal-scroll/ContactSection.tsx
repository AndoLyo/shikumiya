"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const socialLinks = [
  { name: "X / Twitter", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "Dribbble", href: "#" },
  { name: "LinkedIn", href: "#" },
];

export function ContactSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 py-32">
      {/* Background accent glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(230,57,70,0.05)_0%,_transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Contact
        </motion.p>

        {/* Large heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Let&apos;s Talk
        </motion.h2>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-10 h-[2px] w-16 origin-left"
          style={{ backgroundColor: "var(--color-accent)" }}
        />

        {/* Email link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10"
        >
          <a
            href="mailto:hello@example.com"
            data-cursor-hover
            className="group inline-flex items-center gap-3 text-xl transition-colors duration-300 hover:text-[var(--color-accent)] md:text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            <span>hello@example.com</span>
            <ArrowUpRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              data-cursor-hover
              className="text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-8 w-full text-center"
      >
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          &copy; {new Date().getFullYear()} — All rights reserved
        </p>
      </motion.footer>
    </section>
  );
}
