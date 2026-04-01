"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const works = [
  { title: "Ethereal Garden", category: "Fantasy", src: "/portfolio/work_01.webp" },
  { title: "Celestial Throne", category: "Fantasy", src: "/portfolio/work_02.webp" },
  { title: "Neon Dreamscape", category: "Landscape", src: "/portfolio/work_05.webp" },
  { title: "Mystic Portrait", category: "Portrait", src: "/portfolio/work_07.webp" },
  { title: "Crystal Palace", category: "Fantasy", src: "/portfolio/work_08.webp" },
  { title: "Digital Bloom", category: "Abstract", src: "/portfolio/work_11.webp" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
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

export function WorksSection() {
  return (
    <section id="works" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.5em] text-violet-400">
            WORKS
          </p>
          <h2 className="mt-3 font-serif text-4xl text-white">
            Selected Projects
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {works.map((work, i) => (
            <motion.article
              key={i}
              variants={cardVariants}
              className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="p-6">
                <h3 className="font-serif text-lg text-white">{work.title}</h3>
                <p className="mt-1 font-mono text-xs text-violet-400">
                  {work.category}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
