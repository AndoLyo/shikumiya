"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const works = [
  { title: "Ethereal Garden", src: "/portfolio/work_01.webp" },
  { title: "Neon Dreamscape", src: "/portfolio/work_05.webp" },
  { title: "Crystal Palace", src: "/portfolio/work_08.webp" },
  { title: "Midnight Bloom", src: "/portfolio/work_12.webp" },
  { title: "Aurora Veil", src: "/portfolio/work_15.webp" },
  { title: "Silent Horizon", src: "/portfolio/work_19.webp" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function WorksSection() {
  return (
    <section
      className="tpl-snap-section"
      style={{ background: "var(--color-bg-light)" }}
    >
      <div className="w-full max-w-6xl mx-auto px-6 py-16">
        {/* Section header */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-light tracking-[0.3em]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            WORKS
          </h2>
          <div className="tpl-ornament-line mt-4" />
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {works.map((work) => (
            <motion.div
              key={work.title}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              variants={cardVariants}
            >
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <span className="text-lg tracking-widest font-light opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {work.title}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
