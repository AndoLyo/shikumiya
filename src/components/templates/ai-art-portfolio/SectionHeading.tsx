"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle: string;
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
      <p className="font-mono text-primary text-xs tracking-[0.3em] uppercase mb-2">
        {title}
      </p>
      <h2 className="font-serif text-white text-2xl sm:text-3xl font-bold tracking-wide">
        {subtitle}
      </h2>
      <div className={`mt-4 ${align === "center" ? "mx-auto" : ""} deco-line`} />
    </motion.div>
  );
}
