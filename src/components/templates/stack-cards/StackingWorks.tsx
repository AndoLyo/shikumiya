"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const cards = [
  { title: "Ethereal Garden", category: "Fantasy Art", src: "/portfolio/work_01.webp" },
  { title: "Neon Dreamscape", category: "Landscape", src: "/portfolio/work_05.webp" },
  { title: "Crystal Palace", category: "Fantasy Art", src: "/portfolio/work_08.webp" },
  { title: "Digital Bloom", category: "Abstract", src: "/portfolio/work_11.webp" },
  { title: "Aurora Veil", category: "Landscape", src: "/portfolio/work_15.webp" },
];

function StackCard({
  card,
  index,
  totalCards,
  containerRef,
}: {
  card: (typeof cards)[number];
  index: number;
  totalCards: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;

  const scale = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [1, index < totalCards - 1 ? 0.9 : 1]
  );

  const opacity = useTransform(
    scrollYProgress,
    [cardStart, cardEnd],
    [1, index < totalCards - 1 ? 0.6 : 1]
  );

  return (
    <div
      className="sticky top-0 h-[80vh] sm:h-screen flex items-center justify-center px-3 sm:px-4"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="max-w-[900px] w-full mx-auto rounded-2xl sm:rounded-3xl overflow-hidden p-2 sm:p-4 md:p-8"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: "#161616",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="relative aspect-video w-full rounded-t-3xl overflow-hidden">
            <Image
              src={card.src}
              alt={card.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <p
              className="font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3"
              style={{ color: "#6366f1" }}
            >
              {card.category}
            </p>
            <h3
              className="text-lg sm:text-xl md:text-2xl font-serif font-bold"
              style={{ color: "#e8e8e8" }}
            >
              {card.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function StackingWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section>
      <div className="text-center py-12 sm:py-16 md:py-24">
        <p
          className="font-mono text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-3 sm:mb-4"
          style={{ color: "#6366f1" }}
        >
          WORKS
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold"
          style={{ color: "#e8e8e8" }}
        >
          Selected Projects
        </h2>
      </div>

      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${cards.length * 100}vh` }}
      >
        {cards.map((card, i) => (
          <StackCard
            key={card.title}
            card={card}
            index={i}
            totalCards={cards.length}
            containerRef={containerRef}
          />
        ))}
      </div>
    </section>
  );
}
