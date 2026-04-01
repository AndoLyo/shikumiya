"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const works = [
  { title: "Ethereal Garden", category: "Fantasy", src: "/portfolio/work_01.webp" },
  { title: "Silent Gaze", category: "Portrait", src: "/portfolio/work_03.webp" },
  { title: "Floating Ruins", category: "Fantasy", src: "/portfolio/work_06.webp" },
  { title: "Golden Hour", category: "Landscape", src: "/portfolio/work_09.webp" },
  { title: "Midnight Bloom", category: "Fantasy", src: "/portfolio/work_12.webp" },
  { title: "Aurora Veil", category: "Landscape", src: "/portfolio/work_15.webp" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function WorksSection() {
  return (
    <section
      id="works"
      className="px-6 py-24 md:py-32"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-accent-gold)" }}
          >
            Works
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Selected Projects
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span
              className="inline-block h-px w-8"
              style={{ backgroundColor: "var(--color-border)" }}
            />
            <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
              <path
                d="M8 0 L16 14 L0 14 Z"
                fill="var(--color-accent-gold)"
                opacity="0.5"
              />
            </svg>
            <span
              className="inline-block h-px w-8"
              style={{ backgroundColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {works.map((w, i) => (
            <motion.div
              key={w.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={w.src}
                  alt={w.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-text)",
                  }}
                >
                  {w.category}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug">
                  {w.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
