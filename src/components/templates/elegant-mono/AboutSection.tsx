"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { OrnamentalDivider } from "./OrnamentalDivider";

const stats = [
  { value: "150+", label: "プロジェクト" },
  { value: "8", label: "年" },
  { value: "40+", label: "クライアント" },
  { value: "12", label: "受賞" },
];

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex items-center py-32 px-8"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg) 0%, #1e1e1e 50%, var(--color-bg) 100%)",
      }}
    >
      <motion.div
        ref={contentRef}
        style={{ y }}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center">
            <OrnamentalDivider width={100} color="#555555" />
          </div>
          <h2
            className="text-4xl md:text-5xl tracking-[0.4em] uppercase font-normal my-4"
            style={{ color: "var(--color-text)" }}
          >
            About
          </h2>
          <div className="flex justify-center">
            <OrnamentalDivider width={100} color="#555555" />
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 space-y-6"
          style={{ lineHeight: "2" }}
        >
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            意味のあるビジュアル体験を創り出すことに情熱を注いでいます。8年以上の経験を通じて、一つひとつの作品に{" "}
            <span style={{ color: "var(--color-accent-pink)" }}>
              ストーリーを宿らせる
            </span>{" "}
            ことを大切にしています。
          </p>
          <p style={{ color: "var(--color-text-muted)" }}>
            最小限のデザインの中に、最大限の表現力を。{" "}
            <span style={{ color: "var(--color-accent-pink)" }}>
              シンプルでありながら
            </span>{" "}
            、見る人の心に深く残る作品を目指しています。
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl md:text-4xl font-normal tracking-wider"
                style={{ color: "var(--color-accent)" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs tracking-[0.2em] uppercase mt-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
