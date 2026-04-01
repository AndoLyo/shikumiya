"use client";

import { motion } from "framer-motion";
import { Palette, Code, Megaphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: ServiceCard[] = [
  {
    icon: Palette,
    title: "Design",
    description:
      "Branding, web design, and visual identity that communicates warmth and professionalism. Every pixel serves a purpose.",
  },
  {
    icon: Code,
    title: "Development",
    description:
      "Clean, performant code built with modern frameworks. Responsive, accessible, and fast — from prototype to production.",
  },
  {
    icon: Megaphone,
    title: "Strategy",
    description:
      "Content planning, SEO, and social media strategy that grows your audience organically and sustainably.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-accent-gold)" }}
          >
            Services
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">What I Do</h2>
        </div>

        {/* Cards */}
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={cardVariants}
              className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              style={{ borderTop: "3px solid var(--color-accent)" }}
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--color-accent)", opacity: 0.9 }}
              >
                <s.icon size={22} color="var(--color-text)" />
              </div>
              <h3 className="mb-3 text-lg font-bold">{s.title}</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
