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
      {/* Geometric accent (moufdesign inspired) */}
      <div
        className={`flex items-center gap-3 mb-4 ${align === "center" ? "justify-center" : ""}`}
      >
        <div className="w-2 h-2 rotate-45 bg-primary/60" />
        <div className="w-8 h-px bg-gradient-to-r from-primary/40 to-transparent" />
      </div>

      <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 font-mono text-primary text-xs sm:text-sm tracking-[0.3em] uppercase">
          {subtitle}
        </p>
      )}
      <div
        className="mt-4 w-[60px] h-px bg-gradient-to-r from-transparent via-primary to-transparent"
        style={align === "center" ? { margin: "1rem auto 0" } : {}}
      />
    </motion.div>
  );
}
