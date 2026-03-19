"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const works = [
  { src: "/portfolio/work_01.webp", title: "Fantasy Character" },
  { src: "/portfolio/work_02.webp", title: "Portrait Study" },
  { src: "/portfolio/work_04.webp", title: "Atmospheric Scene" },
  { src: "/portfolio/work_05.webp", title: "Character Design" },
  { src: "/portfolio/work_06.webp", title: "Landscape" },
  { src: "/portfolio/work_07.webp", title: "Detailed Portrait" },
  { src: "/portfolio/work_08.webp", title: "Dramatic Lighting" },
  { src: "/portfolio/work_09.webp", title: "Fantasy World" },
  { src: "/portfolio/work_10.webp", title: "Concept Art" },
  { src: "/portfolio/work_11.webp", title: "Digital Painting" },
  { src: "/portfolio/work_12.webp", title: "Cinematic Shot" },
  { src: "/portfolio/work_13.webp", title: "Character Illustration" },
  { src: "/portfolio/work_14.webp", title: "Environment Art" },
  { src: "/portfolio/work_15.webp", title: "Steampunk Detail" },
  { src: "/portfolio/work_16.webp", title: "Abstract Beauty" },
  { src: "/portfolio/work_17.webp", title: "Photo-realistic" },
  { src: "/portfolio/work_18.webp", title: "Upscaled Art" },
  { src: "/portfolio/work_19.webp", title: "Norse Fantasy" },
  { src: "/portfolio/work_20.webp", title: "Fire & Water" },
  { src: "/portfolio/work_21.webp", title: "Precision Detail" },
  { src: "/portfolio/work_22.webp", title: "Portrait Render" },
];

export default function PortfolioSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? works : works.slice(0, 12);

  return (
    <section id="portfolio" className="section-padding bg-[#0d0d12]">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading title="PORTFOLIO" subtitle="作品ギャラリー" align="center" />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          3年間のAIアート研究から生まれた作品たち。
          Midjourney・Stable Diffusion・Flux等で制作し、Magnific AIでアップスケール。
        </motion.p>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
          {displayed.map((work, i) => (
            <motion.div
              key={work.src}
              className="relative aspect-square cursor-pointer overflow-hidden group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              onClick={() => setSelected(i)}
            >
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end justify-start p-4">
                <span className="text-white text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {work.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more / less */}
        {works.length > 12 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 border border-primary/30 text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/10 transition-all cursor-pointer"
            >
              {showAll ? "Show Less" : `Show All ${works.length} Works`}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={works[selected].src}
                alt={works[selected].title}
                width={1200}
                height={1200}
                className="object-contain max-h-[85vh] w-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-mono text-sm">{works[selected].title}</p>
              </div>
              {/* Navigation */}
              {selected > 0 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-primary/30 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setSelected(selected - 1); }}
                >
                  ‹
                </button>
              )}
              {selected < works.length - 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-primary/30 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setSelected(selected + 1); }}
                >
                  ›
                </button>
              )}
            </motion.div>
            {/* Close hint */}
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl font-light cursor-pointer"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
