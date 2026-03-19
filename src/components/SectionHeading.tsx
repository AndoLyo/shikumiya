"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
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
      <h2
        className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-wide"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 font-mono text-primary text-xs sm:text-sm tracking-[0.3em] uppercase">
          {subtitle}
        </p>
      )}
      <div className="mt-4 deco-line mx-0" style={align === "center" ? { margin: "1rem auto 0" } : {}} />
    </motion.div>
  );
}
