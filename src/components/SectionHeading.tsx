"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  number,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  number?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      className={`mb-12 ${align === "center" ? "text-center" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative number */}
      {number && (
        <span className="block font-mono text-primary/40 text-xs tracking-[0.4em] mb-3">
          {number}
        </span>
      )}

      {/* Main title in Japanese */}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-3 text-text-secondary text-sm tracking-wide">
          {subtitle}
        </p>
      )}

      <div
        className="mt-4 deco-line mx-0"
        style={align === "center" ? { margin: "1rem auto 0" } : {}}
      />
    </motion.div>
  );
}
