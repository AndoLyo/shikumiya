"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const works = [
  { id: "01", title: "Ethereal Garden", category: "Fantasy", src: "/portfolio/work_01.webp" },
  { id: "02", title: "Celestial Throne", category: "Fantasy", src: "/portfolio/work_02.webp" },
  { id: "03", title: "Silent Gaze", category: "Portrait", src: "/portfolio/work_03.webp" },
  { id: "04", title: "Neon Dreamscape", category: "Landscape", src: "/portfolio/work_05.webp" },
  { id: "05", title: "Mystic Portrait", category: "Portrait", src: "/portfolio/work_07.webp" },
  { id: "06", title: "Crystal Palace", category: "Fantasy", src: "/portfolio/work_08.webp" },
  { id: "07", title: "Midnight Bloom", category: "Fantasy", src: "/portfolio/work_12.webp" },
  { id: "08", title: "Silent Horizon", category: "Landscape", src: "/portfolio/work_19.webp" },
];

function WorkCard({
  work,
  index,
}: {
  work: (typeof works)[number];
  index: number;
}) {
  return (
    <motion.div
      className="group relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-[85vw] sm:w-[80vw] max-w-[600px] flex-shrink-0 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Image
        src={work.src}
        alt={work.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="80vw"
      />

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]" />

      {/* Large faded number */}
      <span
        className="absolute top-4 left-4 text-[4rem] sm:text-[6rem] md:text-[8rem] font-bold leading-none opacity-10 select-none"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {work.id}
      </span>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent">
        <p
          className="mb-2 text-xs tracking-[0.2em] uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          {work.category}
        </p>
        <h3
          className="text-2xl font-bold leading-tight md:text-3xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {work.title}
        </h3>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/40">
        <motion.span
          className="text-sm font-medium tracking-[0.3em] uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ color: "var(--color-text)" }}
        >
          詳しく見る
        </motion.span>
      </div>

      {/* Border */}
      <div
        className="absolute inset-0 border transition-colors duration-500 group-hover:border-[var(--color-accent)]"
        style={{ borderColor: "var(--color-border)" }}
      />
    </motion.div>
  );
}

export function HorizontalWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-87.5%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 z-20 pointer-events-none">
        <div className="absolute top-8 left-8">
          <p
            className="text-[10px] sm:text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Selected Works
          </p>
        </div>
      </div>

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div className="flex gap-8 pl-[10vw]" style={{ x }}>
          {works.map((work, i) => (
            <WorkCard key={work.id} work={work} index={i} />
          ))}

          <div className="flex h-[50vh] sm:h-[60vh] md:h-[70vh] w-[70vw] sm:w-[40vw] flex-shrink-0 items-center justify-center">
            <div className="text-center">
              <p
                className="text-sm tracking-[0.2em] uppercase"
                style={{ color: "var(--color-text-muted)" }}
              >
                That&apos;s a glimpse
              </p>
              <p
                className="mt-4 text-4xl font-bold md:text-5xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                See more below
              </p>
              <div
                className="mx-auto mt-6 h-[2px] w-12"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none sticky bottom-8 z-20 mx-8">
        <div className="mx-auto max-w-md">
          <div
            className="h-[1px] w-full overflow-hidden"
            style={{ backgroundColor: "var(--color-border)" }}
          >
            <motion.div
              className="h-full origin-left"
              style={{
                width: progressWidth,
                backgroundColor: "var(--color-accent)",
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span>01</span>
            <span>08</span>
          </div>
        </div>
      </div>
    </section>
  );
}
