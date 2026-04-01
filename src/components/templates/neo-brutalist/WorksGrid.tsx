"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface WorkItem {
  id: number;
  number: string;
  title: string;
  category: string;
  src: string;
  color: string;
  colSpan: string;
  rowSpan: string;
  mobileColSpan: string;
}

const works: WorkItem[] = [
  {
    id: 1,
    number: "01",
    title: "Ethereal Garden",
    category: "Fantasy Art",
    src: "/portfolio/work_01.webp",
    color: "#ff5722",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    mobileColSpan: "col-span-1",
  },
  {
    id: 2,
    number: "02",
    title: "Celestial Throne",
    category: "Fantasy Art",
    src: "/portfolio/work_02.webp",
    color: "#2563eb",
    colSpan: "md:col-span-1",
    rowSpan: "",
    mobileColSpan: "col-span-1",
  },
  {
    id: 3,
    number: "03",
    title: "Silent Gaze",
    category: "Portrait",
    src: "/portfolio/work_03.webp",
    color: "#fbbf24",
    colSpan: "md:col-span-1",
    rowSpan: "",
    mobileColSpan: "col-span-1",
  },
  {
    id: 4,
    number: "04",
    title: "Neon Dreamscape",
    category: "Landscape",
    src: "/portfolio/work_05.webp",
    color: "#ff5722",
    colSpan: "md:col-span-1",
    rowSpan: "",
    mobileColSpan: "col-span-1",
  },
  {
    id: 5,
    number: "05",
    title: "Crystal Palace",
    category: "Fantasy Art",
    src: "/portfolio/work_08.webp",
    color: "#2563eb",
    colSpan: "md:col-span-2",
    rowSpan: "",
    mobileColSpan: "col-span-1",
  },
  {
    id: 6,
    number: "06",
    title: "Digital Bloom",
    category: "Abstract",
    src: "/portfolio/work_11.webp",
    color: "#fbbf24",
    colSpan: "md:col-span-1",
    rowSpan: "",
    mobileColSpan: "col-span-1",
  },
];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 14,
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function WorksGrid() {
  return (
    <section className="px-3 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-16 md:py-20">
      <div
        className="w-full max-w-[1400px] mx-auto"
        style={{ borderTop: "4px solid #1a1a1a" }}
      >
        <div className="pt-12 pb-12">
          <h2
            className="font-black uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              color: "#1a1a1a",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            WORKS
          </h2>
          <div
            className="mt-2 w-48 h-2"
            style={{ backgroundColor: "#ff5722" }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0"
        >
          {works.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`group relative cursor-pointer ${item.mobileColSpan} ${item.colSpan} ${item.rowSpan} overflow-hidden`}
              style={{
                border: "3px solid #1a1a1a",
                marginTop: "-3px",
                marginLeft: "-3px",
              }}
            >
              <div className="relative min-h-[250px] h-full">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-end p-6">
                  <span
                    className="font-black text-5xl leading-none text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {item.number}
                  </span>
                  <h3
                    className="font-black uppercase text-xl mt-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs mt-1 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
