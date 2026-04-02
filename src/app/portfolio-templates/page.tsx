"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
  Monitor,
  Tablet,
  Smartphone,
  Columns2,
  Columns3,
  Square,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  nameJa: string;
  icon: LucideIcon;
  dotColor: string;
  features: string[];
  colors: string[];
  iconColor: string;
}

const templates: Template[] = [
  {
    id: "pastel-pop",
    name: "Pastel Pop",
    nameJa: "パステル・ポップ",
    icon: Heart,
    dotColor: "#FF7EB3",
    features: ["Masonry", "フィルター", "パステル"],
    colors: ["#FFF5F9", "#FF7EB3", "#7EC8E3"],
    iconColor: "text-pink-400",
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    nameJa: "サイバー・ネオン",
    icon: Cpu,
    dotColor: "#00F0FF",
    features: ["グリッチ", "スナップ", "ネオン"],
    colors: ["#0A0A14", "#00F0FF", "#FF00E5"],
    iconColor: "text-cyan-400",
  },
  {
    id: "ink-wash",
    name: "Ink Wash",
    nameJa: "墨絵・和風",
    icon: Brush,
    dotColor: "#C73E3A",
    features: ["縦書き", "横スクロール", "判子"],
    colors: ["#F5F0E8", "#C73E3A", "#3D6B5E"],
    iconColor: "text-red-400",
  },
  {
    id: "studio-white",
    name: "Studio White",
    nameJa: "スタジオ・ホワイト",
    icon: Frame,
    dotColor: "#000000",
    features: ["ライトボックス", "サイドナビ", "ミニマル"],
    colors: ["#FAFAFA", "#000000", "#999999"],
    iconColor: "text-gray-400",
  },
  {
    id: "retro-pop",
    name: "Retro Pop",
    nameJa: "レトロ・ポップ",
    icon: Zap,
    dotColor: "#FF6B35",
    features: ["コラージュ", "太ボーダー", "ビビッド"],
    colors: ["#FFFDF0", "#FF6B35", "#00B4D8"],
    iconColor: "text-orange-400",
  },
  {
    id: "dark-elegance",
    name: "Dark Elegance",
    nameJa: "ダーク・エレガンス",
    icon: Crown,
    dotColor: "#C9A96E",
    features: ["フルスクリーン", "自動再生", "オーバーレイ"],
    colors: ["#0D0D0D", "#C9A96E", "#F0EDE6"],
    iconColor: "text-amber-400",
  },
  {
    id: "watercolor-soft",
    name: "Watercolor Soft",
    nameJa: "水彩・ソフト",
    icon: Droplets,
    dotColor: "#7FB5D5",
    features: ["有機的SVG", "フロストガラス", "水彩"],
    colors: ["#F8F5F0", "#7FB5D5", "#E8B4C8"],
    iconColor: "text-blue-400",
  },
  {
    id: "comic-panel",
    name: "Comic Panel",
    nameJa: "コミック・パネル",
    icon: BookOpen,
    dotColor: "#E63946",
    features: ["コマ割り", "吹き出し", "集中線"],
    colors: ["#FFFEF5", "#E63946", "#2563EB"],
    iconColor: "text-red-500",
  },
  {
    id: "floating-gallery",
    name: "Floating Gallery",
    nameJa: "フローティング・ギャラリー",
    icon: Box,
    dotColor: "#6C63FF",
    features: ["3Dチルト", "パララックス", "グラスUI"],
    colors: ["#111118", "#6C63FF", "#A5A0FF"],
    iconColor: "text-indigo-400",
  },
  {
    id: "mosaic-bold",
    name: "Mosaic Bold",
    nameJa: "モザイク・ボールド",
    icon: Grid3X3,
    dotColor: "#FF3D00",
    features: ["モザイク", "B&W→カラー", "極太タイポ"],
    colors: ["#F5F5F5", "#FF3D00", "#0A0A0A"],
    iconColor: "text-orange-500",
  },
];

type DeviceSize = "mobile" | "tablet" | "desktop";
type ColumnCount = 1 | 2 | 3;

const deviceConfig: Record<
  DeviceSize,
  { label: string; sublabel: string; width: string; height: string; icon: LucideIcon }
> = {
  mobile: {
    label: "スマートフォン",
    sublabel: "375 × 667",
    width: "375px",
    height: "667px",
    icon: Smartphone,
  },
  tablet: {
    label: "タブレット",
    sublabel: "768 × 1024",
    width: "768px",
    height: "800px",
    icon: Tablet,
  },
  desktop: {
    label: "デスクトップ",
    sublabel: "1280 × 800",
    width: "100%",
    height: "800px",
    icon: Monitor,
  },
};

const columnIcons: Record<ColumnCount, { icon: LucideIcon; label: string }> = {
  1: { icon: Square, label: "1列" },
  2: { icon: Columns2, label: "2列" },
  3: { icon: Columns3, label: "3列" },
};

export default function PortfolioTemplatesPage() {
  const [device, setDevice] = useState<DeviceSize>("desktop");
  const [columns, setColumns] = useState<ColumnCount>(2);
  const config = deviceConfig[device];

  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div
      style={{
        backgroundColor: "#0a0a0f",
        color: "#e5e5e5",
        minHeight: "100vh",
      }}
    >
      {/* ===== ヘッダー ===== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-1 h-8 bg-[#00e5ff] rounded-full" />
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-sm font-bold text-white tracking-wide">
                しくみや
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#999] group-hover:text-[#00e5ff] transition-colors">
                by Lyo Vision
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="font-mono text-xs text-[#999] hover:text-[#00e5ff] transition-colors tracking-wider"
          >
            ← トップに戻る
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* ===== タイトル ===== */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <p className="font-mono text-[11px] tracking-[0.3em] text-[#00e5ff] uppercase mb-2">
              全テンプレート一覧
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-bold">
              ポートフォリオテンプレート
            </h1>
            <p className="text-[#999] text-sm mt-3 max-w-[540px] mx-auto leading-relaxed">
              全10種類のテンプレートを一覧で確認できます。デバイス表示やレイアウトを切り替えて、実際の見え方をチェックしてください。
            </p>
          </motion.div>

          {/* ===== コントロールバー ===== */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* 現在のサイズ表示 */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <config.icon className="w-3.5 h-3.5 text-[#666]" />
              <span className="text-[11px] font-mono text-[#888]">
                {config.label}
                <span className="text-[#555] ml-1.5">{config.sublabel}</span>
              </span>
            </div>

            {/* デバイス切替 */}
            <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
              {(Object.keys(deviceConfig) as DeviceSize[]).map((key) => {
                const d = deviceConfig[key];
                const Icon = d.icon;
                const active = device === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDevice(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-[#00e5ff]/10 text-[#00e5ff] border-r border-white/[0.08]"
                        : "text-[#666] hover:text-[#999] hover:bg-white/[0.02] border-r border-white/[0.08]"
                    } last:border-r-0`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{d.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 区切り */}
            <div className="hidden sm:block w-px h-6 bg-white/[0.08]" />

            {/* カラム切替 */}
            <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
              {([1, 2, 3] as ColumnCount[]).map((n) => {
                const c = columnIcons[n];
                const Icon = c.icon;
                const active = columns === n;
                return (
                  <button
                    key={n}
                    onClick={() => setColumns(n)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-[#00e5ff]/10 text-[#00e5ff] border-r border-white/[0.08]"
                        : "text-[#666] hover:text-[#999] hover:bg-white/[0.02] border-r border-white/[0.08]"
                    } last:border-r-0`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ===== テンプレートグリッド ===== */}
        <section className="max-w-[1800px] mx-auto px-4 sm:px-6">
          <div className={`grid ${gridCols} gap-5`}>
            {templates.map((tpl, i) => {
              const Icon = tpl.icon;
              return (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#0d0d15] hover:border-white/[0.15] transition-colors duration-300"
                >
                  {/* カードヘッダー */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0a0a12]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: tpl.dotColor }}
                      />
                      <Icon
                        className={`w-3.5 h-3.5 ${tpl.iconColor}`}
                        strokeWidth={1.5}
                      />
                      <span className="text-white text-[13px] font-medium">
                        {tpl.name}
                      </span>
                      <span className="text-[#666] text-[11px] font-mono">
                        {tpl.nameJa}
                      </span>
                    </div>
                    <Link
                      href={`/portfolio-templates/${tpl.id}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-[11px] font-mono text-[#00e5ff] px-2.5 py-1 rounded-md border border-[#00e5ff]/20 hover:bg-[#00e5ff]/10 hover:border-[#00e5ff]/40 transition-all duration-200"
                    >
                      <ExternalLink className="w-3 h-3" />
                      全画面で見る
                    </Link>
                  </div>

                  {/* iframeプレビュー */}
                  <div
                    className="bg-[#111] overflow-hidden"
                    style={{
                      maxWidth:
                        device === "desktop" ? "none" : config.width,
                      margin:
                        device === "desktop" ? "0" : "0 auto",
                    }}
                  >
                    <iframe
                      src={`/portfolio-templates/${tpl.id}`}
                      style={{ height: config.height }}
                      className="w-full border-0"
                      loading="lazy"
                      title={tpl.name}
                    />
                  </div>

                  {/* カードフッター */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06]">
                    <div className="flex gap-1.5 flex-wrap">
                      {tpl.features.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-mono text-[#666] px-2 py-0.5 border border-white/[0.06] rounded-full"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#555] text-[9px] font-mono mr-1">
                        配色
                      </span>
                      {tpl.colors.map((c) => (
                        <div
                          key={c}
                          className="w-4 h-4 rounded-full border border-white/10"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="max-w-[700px] mx-auto px-6 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold mb-4">
              あなたのポートフォリオを作りませんか？
            </h3>
            <p className="text-[#999] text-sm mb-8 leading-relaxed">
              テンプレートを選んで、フォームに入力するだけ。あなただけのギャラリーサイトが完成します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/40 text-[#00e5ff] font-mono text-xs tracking-widest uppercase hover:bg-[#00e5ff]/20 hover:border-[#00e5ff]/60 transition-all duration-300"
              >
                サイトを作る →
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/[0.1] text-[#999] font-mono text-xs tracking-widest uppercase hover:border-white/[0.2] hover:text-white transition-all duration-300"
              >
                トップに戻る
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8 text-center">
        <p className="text-[#666] text-xs font-mono">
          &copy; 2026 Lyo Vision. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
