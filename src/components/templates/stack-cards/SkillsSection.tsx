"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Code,
  Play,
  Lightbulb,
  Box,
  Camera,
} from "lucide-react";

const skills = [
  {
    icon: Palette,
    title: "Design",
    description: "デジタル・印刷メディアにおいて、精密で意図のあるビジュアル体験を設計します。",
  },
  {
    icon: Code,
    title: "Development",
    description: "モダンなフレームワークとツールで、高速でアクセシブルなWebアプリを構築します。",
  },
  {
    icon: Play,
    title: "Motion",
    description: "目的のあるアニメーションとマイクロインタラクションで、UIに命を吹き込みます。",
  },
  {
    icon: Lightbulb,
    title: "Strategy",
    description: "リサーチに基づいた意思決定で、クリエイティブの方向性とビジネスゴールを一致させます。",
  },
  {
    icon: Box,
    title: "3D",
    description: "Webやインタラクティブインスタレーション向けの没入型3D体験を制作します。",
  },
  {
    icon: Camera,
    title: "Photography",
    description: "構図・光・ストーリーテリングを意識した瞬間の切り取りを行います。",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
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

export function SkillsSection() {
  return (
    <section className="py-32 px-4" style={{ backgroundColor: "#0c0c0c" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p
            className="font-mono text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: "#6366f1" }}
          >
            SKILLS
          </p>
          <h2
            className="text-4xl md:text-5xl font-serif font-bold"
            style={{ color: "#e8e8e8" }}
          >
            できること
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.title}
              variants={itemVariants}
              className="group rounded-2xl p-8 transition-colors duration-300"
              style={{
                backgroundColor: "#161616",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              whileHover={{
                borderColor: "rgba(99,102,241,0.3)",
                boxShadow: "0 0 30px rgba(99,102,241,0.05)",
              }}
            >
              <skill.icon
                size={28}
                className="mb-5"
                style={{ color: "#6366f1" }}
              />
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: "#e8e8e8" }}
              >
                {skill.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#555555" }}>
                {skill.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
