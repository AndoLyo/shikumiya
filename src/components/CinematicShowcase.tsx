"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Cpu,
  Brush,
  Frame,
  Zap,
  Crown,
  Droplets,
  BookOpen,
  Box,
  Grid3X3,
  Play,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";

interface Template {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  colors: string[];
  iconColor: string;
}

const templates: Template[] = [
  {
    id: "pastel-pop",
    name: "Pastel Pop",
    tagline: "かわいい系Masonryギャラリー",
    icon: Heart,
    colors: ["#FFF5F9", "#FF7EB3", "#7EC8E3"],
    iconColor: "text-pink-400",
  },
  {
    id: "dark-elegance",
    name: "Dark Elegance",
    tagline: "ラグジュアリーなフルスクリーン",
    icon: Crown,
    colors: ["#0D0D0D", "#C9A96E", "#F0EDE6"],
    iconColor: "text-amber-400",
  },
  {
    id: "comic-panel",
    name: "Comic Panel",
    tagline: "漫画コマ割りレイアウト",
    icon: BookOpen,
    colors: ["#FFFEF5", "#E63946", "#2563EB"],
    iconColor: "text-red-500",
  },
  {
    id: "floating-gallery",
    name: "Floating Gallery",
    tagline: "3D浮遊カードギャラリー",
    icon: Box,
    colors: ["#111118", "#6C63FF", "#A5A0FF"],
    iconColor: "text-indigo-400",
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    tagline: "ネオングロウのサイバー空間",
    icon: Cpu,
    colors: ["#0A0A14", "#00F0FF", "#FF00E5"],
    iconColor: "text-cyan-400",
  },
  {
    id: "ink-wash",
    name: "Ink Wash",
    tagline: "和紙と墨の伝統美",
    icon: Brush,
    colors: ["#F5F0E8", "#C73E3A", "#3D6B5E"],
    iconColor: "text-red-400",
  },
  {
    id: "studio-white",
    name: "Studio White",
    tagline: "美術館のような余白",
    icon: Frame,
    colors: ["#FAFAFA", "#000000", "#999999"],
    iconColor: "text-gray-400",
  },
  {
    id: "retro-pop",
    name: "Retro Pop",
    tagline: "90年代レトロな非対称",
    icon: Zap,
    colors: ["#FFFDF0", "#FF6B35", "#00B4D8"],
    iconColor: "text-orange-400",
  },
  {
    id: "watercolor-soft",
    name: "Watercolor Soft",
    tagline: "水彩画のような柔らかさ",
    icon: Droplets,
    colors: ["#F8F5F0", "#7FB5D5", "#E8B4C8"],
    iconColor: "text-blue-400",
  },
  {
    id: "mosaic-bold",
    name: "Mosaic Bold",
    tagline: "大型タイルと極太タイポ",
    icon: Grid3X3,
    colors: ["#F5F5F5", "#FF3D00", "#0A0A0A"],
    iconColor: "text-orange-500",
  },
];

const initialTemplates = templates.slice(0, 4);
const hiddenTemplates = templates.slice(4);

function TemplateCard({
  tpl,
  index,
  delayBase = 0,
}: {
  tpl: Template;
  index: number;
  delayBase?: number;
}) {
  const Icon = tpl.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: delayBase + index * 0.08 }}
    >
      <Link
        href={`/portfolio-templates/${tpl.id}`}
        className="group block rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1"
      >
        {/* Screenshot Preview */}
        <div className="h-40 sm:h-52 relative overflow-hidden" style={{ background: tpl.colors[0] }}>
          <Image
            src={`/previews/${tpl.id}.webp`}
            alt={tpl.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 300px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <span className="text-white text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 drop-shadow-lg font-mono">
              デモを見る →
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3 bg-[#0d0d15]">
          <div className="flex items-center gap-2.5 mb-0.5">
            <Icon className={`w-4 h-4 ${tpl.iconColor}`} strokeWidth={1.5} />
            <p className="text-white text-sm font-medium group-hover:text-primary transition-colors truncate">
              {tpl.name}
            </p>
          </div>
          <p className="text-text-muted text-[11px] truncate pl-6.5">
            {tpl.tagline}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CinematicShowcase() {
  const [isRevealed, setIsRevealed] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  const handleReveal = () => {
    setIsRevealed(true);
    // Scroll to reveal area after animation starts
    setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 800);
  };

  return (
    <section
      id="showcase"
      className="relative section-padding overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#080810]" />
      <div className="absolute inset-0 mesh-gradient-2" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading
          title="制作実績"
          subtitle="あなたの作品が映えるデザイン、10種類用意しました。"
          number="— 01"
          align="center"
        />

        {/* Initial 4 templates — always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {initialTemplates.map((tpl, i) => (
            <TemplateCard key={tpl.id} tpl={tpl} index={i} />
          ))}
        </div>

        {/* Reveal button — only shown before reveal */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              className="flex justify-center mt-12"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleReveal}
                className="group relative cursor-pointer"
              >
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-primary/30"
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative flex items-center gap-3 px-8 py-4 rounded-2xl border border-primary/40 bg-[#0a0a0f]/80 backdrop-blur-sm group-hover:border-primary/70 transition-all duration-300">
                  <Play
                    className="w-5 h-5 text-primary fill-primary/20 group-hover:fill-primary/40 transition-colors"
                    strokeWidth={1.5}
                  />
                  <div className="text-left">
                    <p className="text-primary font-bold text-sm tracking-wider">
                      残り6種類を見る
                    </p>
                    <p className="text-text-muted text-[10px] tracking-wider font-mono">
                      MORE TEMPLATES
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-primary/50 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== CINEMATIC CURTAIN REVEAL ====== */}
        <AnimatePresence>
          {isRevealed && (
            <div ref={revealRef} className="relative mt-16">
              {/* Curtain container */}
              <div className="relative overflow-hidden">
                {/* Left curtain */}
                <motion.div
                  className="absolute inset-y-0 left-0 w-1/2 z-20"
                  style={{
                    background:
                      "linear-gradient(90deg, #080810 60%, rgba(8,8,16,0.95))",
                  }}
                  initial={{ x: 0 }}
                  animate={{ x: "-105%" }}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
                >
                  {/* Curtain texture — vertical lines */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.03) 30px, rgba(255,255,255,0.03) 31px)",
                    }}
                  />
                  {/* Gold edge */}
                  <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#C9A96E] to-transparent" />
                </motion.div>

                {/* Right curtain */}
                <motion.div
                  className="absolute inset-y-0 right-0 w-1/2 z-20"
                  style={{
                    background:
                      "linear-gradient(-90deg, #080810 60%, rgba(8,8,16,0.95))",
                  }}
                  initial={{ x: 0 }}
                  animate={{ x: "105%" }}
                  transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.03) 30px, rgba(255,255,255,0.03) 31px)",
                    }}
                  />
                  {/* Gold edge */}
                  <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#C9A96E] to-transparent" />
                </motion.div>

                {/* Center split light flash */}
                <motion.div
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[4px] z-30 pointer-events-none"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scaleY: [0, 1, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    times: [0, 0.3, 1],
                    ease: "easeOut",
                  }}
                >
                  <div className="h-full bg-gradient-to-b from-transparent via-primary/80 to-transparent blur-[2px]" />
                </motion.div>

                {/* Spotlight glow after curtain opens */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                >
                  <div className="w-full h-full bg-primary/5 rounded-full blur-[80px]" />
                </motion.div>

                {/* Section title behind curtain */}
                <motion.div
                  className="text-center pt-4 pb-10 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <p className="font-mono text-primary/60 text-[11px] tracking-[0.4em] mb-3">
                    — MORE DESIGNS
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold">
                    まだまだあります
                  </h3>
                  <div className="mt-4 deco-line mx-auto" />
                </motion.div>

                {/* Remaining 6 templates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10 pb-4">
                  {hiddenTemplates.map((tpl, i) => (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.8 + i * 0.12,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={`/portfolio-templates/${tpl.id}`}
                        className="group block rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="h-36 sm:h-44 relative overflow-hidden" style={{ background: tpl.colors[0] }}>
                          <Image
                            src={`/previews/${tpl.id}.webp`}
                            alt={tpl.name}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 250px"
                          />
                        </div>
                        <div className="px-3 py-2.5 bg-[#0d0d15]">
                          <div className="flex items-center gap-2 mb-0.5">
                            {(() => {
                              const Icon = tpl.icon;
                              return (
                                <Icon
                                  className={`w-3.5 h-3.5 ${tpl.iconColor}`}
                                  strokeWidth={1.5}
                                />
                              );
                            })()}
                            <p className="text-white text-[12px] font-medium group-hover:text-primary transition-colors truncate">
                              {tpl.name}
                            </p>
                          </div>
                          <p className="text-text-muted text-[10px] truncate pl-5.5">
                            {tpl.tagline}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* CTA — 思わず押したくなるボタン */}
        <motion.div
          className="flex justify-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/portfolio-templates" className="group relative">
            {/* Outer glow pulse */}
            <motion.div
              className="absolute -inset-[2px] rounded-2xl opacity-60 blur-[1px]"
              style={{
                background:
                  "linear-gradient(135deg, #00e5ff, #6C63FF, #C9A96E, #00e5ff)",
                backgroundSize: "300% 300%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Ambient glow behind */}
            <motion.div
              className="absolute -inset-4 rounded-3xl pointer-events-none"
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-full h-full bg-primary/20 rounded-3xl blur-[20px]" />
            </motion.div>

            {/* Button body */}
            <div className="relative flex items-center gap-4 px-10 py-5 sm:px-14 sm:py-6 rounded-2xl bg-[#0a0a0f] overflow-hidden">
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1.5,
                }}
              />

              {/* Text */}
              <div className="relative">
                <p className="text-white font-bold text-base sm:text-lg tracking-wider group-hover:text-primary transition-colors duration-300">
                  テンプレート一覧を見る
                </p>
                <p className="text-text-muted text-[10px] sm:text-[11px] font-mono tracking-[0.2em] mt-0.5">
                  VIEW ALL 10 TEMPLATES
                </p>
              </div>

              {/* Arrow */}
              <motion.div
                className="relative flex items-center justify-center w-10 h-10 rounded-full border border-primary/30 bg-primary/5 group-hover:bg-primary/15 group-hover:border-primary/60 transition-all duration-300"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="w-5 h-5 text-primary" strokeWidth={2} />
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
