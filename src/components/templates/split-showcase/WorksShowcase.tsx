"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface WorkItem {
  number: string;
  title: string;
  category: string;
  description: string;
  src: string;
}

const works: WorkItem[] = [
  {
    number: "01",
    title: "Ethereal Garden",
    category: "Fantasy Art",
    description: "幻想的な庭園を描いた作品。光と影のコントラストで、異世界への入口を表現。",
    src: "/portfolio/work_01.webp",
  },
  {
    number: "02",
    title: "Celestial Throne",
    category: "Fantasy Art",
    description: "天空に浮かぶ王座。荘厳な建築と宇宙の調和を追求した一枚。",
    src: "/portfolio/work_02.webp",
  },
  {
    number: "03",
    title: "Silent Gaze",
    category: "Portrait",
    description: "静かな視線の中に秘められた感情。光の演出で内面を描き出す。",
    src: "/portfolio/work_03.webp",
  },
  {
    number: "04",
    title: "Neon Dreamscape",
    category: "Landscape",
    description: "ネオンに照らされた夢の風景。現実と幻想の境界を溶かす。",
    src: "/portfolio/work_05.webp",
  },
  {
    number: "05",
    title: "Crystal Palace",
    category: "Fantasy Art",
    description: "水晶で構築された宮殿。透明感と光の反射が生む幻想的な空間。",
    src: "/portfolio/work_08.webp",
  },
  {
    number: "06",
    title: "Midnight Bloom",
    category: "Fantasy Art",
    description: "真夜中に咲く花。闇の中で輝く生命力を表現した作品。",
    src: "/portfolio/work_12.webp",
  },
];

function WorkSection({ item, index }: { item: WorkItem; index: number }) {
  const isOdd = index % 2 === 0;
  const slideDirection = isOdd ? -60 : 60;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: isOdd ? -40 : 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: "easeOut" as const },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: slideDirection },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: "easeOut" as const },
    },
  };

  const imageBlock = (
    <motion.div
      className="w-full md:w-1/2 min-h-[40vh] sm:min-h-[50vh] md:min-h-screen relative overflow-hidden"
      variants={imageVariants}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Decorative corner accent */}
      <div
        className="absolute top-8 right-8 w-16 h-16 border-t border-r opacity-20"
        style={{ borderColor: "var(--color-accent)" }}
      />
    </motion.div>
  );

  const textBlock = (
    <motion.div
      className="w-full md:w-1/2 min-h-[auto] py-12 sm:min-h-[40vh] md:min-h-screen flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20"
      style={{ backgroundColor: "var(--color-bg)" }}
      variants={textVariants}
    >
      <div className="relative max-w-sm">
        <span
          className="absolute -top-16 -left-4 text-8xl font-serif font-bold select-none pointer-events-none"
          style={{ color: "var(--color-accent)", opacity: 0.1 }}
        >
          {item.number}
        </span>

        <p
          className="text-xs font-mono uppercase mb-4"
          style={{ color: "var(--color-accent)", letterSpacing: "0.25em" }}
        >
          {item.category}
        </p>

        <h3
          className="text-3xl font-serif font-bold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          {item.title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "var(--color-muted)" }}
        >
          {item.description}
        </p>

        <a
          href="#"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase group"
          style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
        >
          詳しく見る
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {index > 0 && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 -mt-6 z-10"
          style={{ backgroundColor: "var(--color-accent)", opacity: 0.3 }}
        />
      )}

      <div className="flex flex-col md:flex-row">
        {isOdd ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </motion.div>
  );
}

export function WorksShowcase() {
  return (
    <section>
      {works.map((item, i) => (
        <WorkSection key={item.number} item={item} index={i} />
      ))}
    </section>
  );
}
