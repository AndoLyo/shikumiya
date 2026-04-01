"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { OrnamentalDivider } from "./OrnamentalDivider";

const galleryItems = [
  { title: "Ethereal Garden", src: "/portfolio/work_01.webp" },
  { title: "Silent Gaze", src: "/portfolio/work_03.webp" },
  { title: "Neon Dreamscape", src: "/portfolio/work_05.webp" },
  { title: "Floating Ruins", src: "/portfolio/work_06.webp" },
  { title: "Crystal Palace", src: "/portfolio/work_08.webp" },
  { title: "Abstract Flow", src: "/portfolio/work_10.webp" },
  { title: "Midnight Bloom", src: "/portfolio/work_12.webp" },
  { title: "Aurora Veil", src: "/portfolio/work_15.webp" },
  { title: "Silent Horizon", src: "/portfolio/work_19.webp" },
];

function GalleryItem({
  item,
  index,
}: {
  item: (typeof galleryItems)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative aspect-square overflow-hidden cursor-pointer"
      style={{
        border: "1px solid var(--color-border)",
      }}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: "inset 0 0 30px rgba(0, 187, 221, 0.15)",
          border: "1px solid rgba(0, 187, 221, 0.3)",
        }}
      />

      {/* Title overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <p className="text-sm tracking-[0.15em] uppercase" style={{ color: "var(--color-text)" }}>
          {item.title}
        </p>
      </div>

      {/* Index number */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span
          className="text-[10px] tracking-[0.2em]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
}

export function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative py-32 px-8 md:px-16 lg:px-24"
      style={{ background: "var(--color-bg)" }}
    >
      <motion.div style={{ y }}>
        <div className="text-center mb-20">
          <div className="flex justify-center">
            <OrnamentalDivider width={120} color="#555555" />
          </div>
          <h2
            className="text-4xl md:text-5xl tracking-[0.4em] uppercase font-normal my-4"
            style={{ color: "var(--color-text)" }}
          >
            Works
          </h2>
          <div className="flex justify-center">
            <OrnamentalDivider width={120} color="#555555" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {galleryItems.map((item, index) => (
            <GalleryItem key={item.title} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
