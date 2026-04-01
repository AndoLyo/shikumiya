"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const categories = ["All", "Fantasy", "Portrait", "Landscape", "Abstract"];

const works = [
  { id: 1, title: "Ethereal Garden", category: "Fantasy", src: "/portfolio/work_01.webp" },
  { id: 2, title: "Celestial Throne", category: "Fantasy", src: "/portfolio/work_02.webp" },
  { id: 3, title: "Silent Gaze", category: "Portrait", src: "/portfolio/work_03.webp" },
  { id: 4, title: "Neon Dreamscape", category: "Landscape", src: "/portfolio/work_05.webp" },
  { id: 5, title: "Floating Ruins", category: "Fantasy", src: "/portfolio/work_06.webp" },
  { id: 6, title: "Mystic Portrait", category: "Portrait", src: "/portfolio/work_07.webp" },
  { id: 7, title: "Crystal Palace", category: "Fantasy", src: "/portfolio/work_08.webp" },
  { id: 8, title: "Golden Hour", category: "Landscape", src: "/portfolio/work_09.webp" },
  { id: 9, title: "Abstract Flow", category: "Abstract", src: "/portfolio/work_10.webp" },
  { id: 10, title: "Digital Bloom", category: "Abstract", src: "/portfolio/work_11.webp" },
  { id: 11, title: "Midnight Bloom", category: "Fantasy", src: "/portfolio/work_12.webp" },
  { id: 12, title: "Enchanted Forest", category: "Landscape", src: "/portfolio/work_14.webp" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function WorksGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredWorks =
    activeCategory === "All"
      ? works
      : works.filter((w) => w.category === activeCategory);

  return (
    <section id="works" className="pb-24">
      {/* Section Header */}
      <div className="mb-12">
        <h2
          className="text-3xl tracking-wider mb-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Works
        </h2>
        <div className="w-12 h-px bg-[var(--color-accent)]" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-6 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs tracking-widest uppercase transition-colors duration-300 pb-1 border-b ${
              activeCategory === cat
                ? "text-[var(--color-accent)] border-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        key={activeCategory}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work) => (
            <motion.div
              key={work.id}
              variants={itemVariants}
              layout
              className="group relative aspect-square cursor-pointer overflow-hidden"
            >
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#2a2a2a]/0 group-hover:bg-[#2a2a2a]/80 transition-all duration-500 flex items-center justify-center">
                <div className="text-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                  <p
                    className="text-white text-sm tracking-wider"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {work.title}
                  </p>
                  <p className="text-white/60 text-[10px] tracking-widest uppercase mt-2">
                    {work.category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
