"use client";

import { motion } from "framer-motion";

const skills = [
  "React",
  "TypeScript",
  "Next.js",
  "Figma",
  "Branding",
  "Motion",
  "Photography",
  "3D",
];

const accentColors = ["#ff5722", "#2563eb", "#fbbf24"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function AboutSection() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20">
      <div
        className="w-full max-w-[1400px] mx-auto"
        style={{ borderTop: "4px solid #1a1a1a" }}
      >
        <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left column — text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2
              className="font-black uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                color: "#1a1a1a",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              ABOUT
            </h2>
            <div
              className="mt-2 w-36 h-2 mb-8"
              style={{ backgroundColor: "#2563eb" }}
            />

            <p
              className="font-mono text-base leading-relaxed mb-8"
              style={{ color: "#1a1a1a" }}
            >
              既成概念を壊す。それが私のデザイン哲学。洗練されたデザインの裏側にある「らしさ」を大切にしています。
            </p>

            <p
              className="font-mono text-base leading-relaxed mb-10"
              style={{ color: "#1a1a1a" }}
            >
              ブランディング、UI/UX、ウェブ開発を専門に、ルールを再定義するクリエイティブを提供します。
            </p>

            {/* Skill tags */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              className="flex flex-wrap gap-3"
            >
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  variants={tagVariants}
                  className="font-mono font-bold uppercase text-sm px-4 py-2 inline-block"
                  style={{
                    border: "2px solid #1a1a1a",
                    backgroundColor: accentColors[i % accentColors.length],
                    color: "#1a1a1a",
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — colored box */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex items-start justify-center md:justify-end"
          >
            <div
              className="aspect-square w-full max-w-[400px] flex items-center justify-center"
              style={{
                border: "4px solid #1a1a1a",
                backgroundColor: "#fbbf24",
              }}
            >
              <span
                className="font-black select-none"
                style={{
                  fontSize: "120px",
                  color: "#1a1a1a",
                  fontFamily: "system-ui, sans-serif",
                  lineHeight: 1,
                }}
              >
                ?
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
