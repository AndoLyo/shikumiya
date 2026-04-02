"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Layout,
  Grid3X3,
  Sun,
  MoveHorizontal,
  Frame,
  Palette,
  SplitSquareHorizontal,
  Layers,
  Zap,
  Sparkles,
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
    id: "cinematic-dark",
    name: "Cinematic Dark",
    tagline: "没入感のあるフルスクリーン",
    icon: Layout,
    colors: ["#0a0a1a", "#00bbdd", "#d42d83"],
    iconColor: "text-cyan-400",
  },
  {
    id: "minimal-grid",
    name: "Minimal Grid",
    tagline: "作品を主役にするグリッド",
    icon: Grid3X3,
    colors: ["#f5f3ef", "#A28D69", "#2a2a2a"],
    iconColor: "text-amber-400",
  },
  {
    id: "warm-natural",
    name: "Warm Natural",
    tagline: "温かみのあるカード型",
    icon: Sun,
    colors: ["#f2eee7", "#fffe3e", "#333333"],
    iconColor: "text-yellow-400",
  },
  {
    id: "horizontal-scroll",
    name: "Horizontal Scroll",
    tagline: "横に流れるエディトリアル",
    icon: MoveHorizontal,
    colors: ["#0a0a0a", "#e63946", "#EFE8D7"],
    iconColor: "text-red-400",
  },
  {
    id: "elegant-mono",
    name: "Elegant Mono",
    tagline: "ギャラリーのような空間",
    icon: Frame,
    colors: ["#1a1a1a", "#00bbdd", "#d42d83"],
    iconColor: "text-violet-400",
  },
  {
    id: "ai-art-portfolio",
    name: "AI Art Portfolio",
    tagline: "AIアート特化の世界観",
    icon: Palette,
    colors: ["#0a0a0f", "#6366f1", "#f59e0b"],
    iconColor: "text-indigo-400",
  },
  {
    id: "split-showcase",
    name: "Split Showcase",
    tagline: "左右分割の構図美",
    icon: SplitSquareHorizontal,
    colors: ["#0c0c0c", "#e8c547", "#f5f0e8"],
    iconColor: "text-yellow-300",
  },
  {
    id: "stack-cards",
    name: "Stack Cards",
    tagline: "カードが重なるスクロール",
    icon: Layers,
    colors: ["#f8f5f0", "#2d5a27", "#1a1a1a"],
    iconColor: "text-emerald-400",
  },
  {
    id: "neo-brutalist",
    name: "Neo Brutalist",
    tagline: "太字と原色のインパクト",
    icon: Zap,
    colors: ["#ffffff", "#ff3d00", "#000000"],
    iconColor: "text-orange-400",
  },
  {
    id: "glass-morphism",
    name: "Glass Morphism",
    tagline: "透過グラスの近未来感",
    icon: Sparkles,
    colors: ["#0f0720", "#a855f7", "#06b6d4"],
    iconColor: "text-purple-400",
  },
];

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#080810]" />
      <div className="absolute inset-0 mesh-gradient-2" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading
          title="制作実績"
          subtitle="あなたの作品が映えるデザインを10種類用意しました。すべてデモで確認できます。"
          number="— 01"
          align="center"
        />

        {/* Template grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {templates.map((tpl, i) => {
            const Icon = tpl.icon;
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/templates/${tpl.id}`}
                  className="group block rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Live Preview */}
                  <div
                    className="h-36 sm:h-44 relative overflow-hidden"
                    style={{ background: tpl.colors[0] }}
                  >
                    <iframe
                      src={`/templates/${tpl.id}`}
                      className="absolute top-0 left-0 border-none pointer-events-none"
                      style={{
                        width: "1280px",
                        height: "800px",
                        transform: "scale(0.18)",
                        transformOrigin: "top left",
                      }}
                      tabIndex={-1}
                      loading="lazy"
                      title={tpl.name}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 drop-shadow-lg">
                        デモを見る →
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-3 py-2.5 bg-[#0d0d15]">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon
                        className={`w-3 h-3 ${tpl.iconColor}`}
                        strokeWidth={2}
                      />
                      <p className="text-white text-[11px] font-medium group-hover:text-primary transition-colors truncate">
                        {tpl.name}
                      </p>
                    </div>
                    <p className="text-text-muted text-[10px] truncate">
                      {tpl.tagline}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-8 py-3 border border-primary/40 text-primary text-xs tracking-widest hover:bg-primary/10 transition-all"
          >
            テンプレート一覧を見る →
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
