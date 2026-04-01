"use client";

import { motion } from "framer-motion";
import { Layout, Grid3X3, Sun, MoveHorizontal, Frame, Palette, ExternalLink, SplitSquareHorizontal, Layers, Zap, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

interface Template {
  id: string;
  name: string;
  nameJa: string;
  icon: LucideIcon;
  description: string;
  features: string[];
  colorPreview: string[];
  iconColor: string;
  iconBg: string;
}

const templates: Template[] = [
  {
    id: "cinematic-dark",
    name: "Cinematic Dark",
    nameJa: "シネマティック・ダーク",
    icon: Layout,
    description:
      "フルスクリーン縦スクロール。スクロールスナップとパーティクル演出で没入感のある体験を作る。",
    features: ["100vh スクロールスナップ", "パーティクル演出", "シアン×ピンク グラデーション"],
    colorPreview: ["#0a0a1a", "#00bbdd", "#d42d83"],
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "minimal-grid",
    name: "Minimal Grid",
    nameJa: "ミニマル・グリッド",
    icon: Grid3X3,
    description:
      "固定サイドバー＋グリッドギャラリー。ホワイトベースにゴールドアクセントで、作品を主役にする構成。",
    features: ["固定サイドバーナビ", "ホバーオーバーレイ", "カテゴリフィルター"],
    colorPreview: ["#f5f3ef", "#A28D69", "#2a2a2a"],
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "warm-natural",
    name: "Warm Natural",
    nameJa: "ウォーム・ナチュラル",
    icon: Sun,
    description:
      "温かみのあるベージュ基調。SVG装飾とカードレイアウトで、親しみやすさとプロ感を両立。",
    features: ["SVGブロブ装飾", "イエローCTA帯", "カードベースUI"],
    colorPreview: ["#f2eee7", "#fffe3e", "#333333"],
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    id: "horizontal-scroll",
    name: "Horizontal Scroll",
    nameJa: "ホリゾンタル・スクロール",
    icon: MoveHorizontal,
    description:
      "縦スクロールで作品が横に流れる。カスタムカーソルとレッドアクセントで、エディトリアルな印象。",
    features: ["横スクロール変換", "カスタムカーソル", "プログレスバー"],
    colorPreview: ["#0a0a0a", "#e63946", "#EFE8D7"],
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/20",
  },
  {
    id: "elegant-mono",
    name: "Elegant Mono",
    nameJa: "エレガント・モノ",
    icon: Frame,
    description:
      "四辺フレーム装飾＋パララックス。モノクロームにSVGオーナメントを添えた、ギャラリーのような空間。",
    features: ["ビューポートフレーム", "ドットナビゲーション", "SVGオーナメント"],
    colorPreview: ["#1a1a1a", "#00bbdd", "#d42d83"],
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "ai-art-portfolio",
    name: "AI Art Portfolio",
    nameJa: "AIアート・ポートフォリオ",
    icon: Palette,
    description:
      "AIアート作品を美しく並べるギャラリー型。ダークテーマにシアンの光が映える、アーティスト向け。",
    features: ["ギャラリーグリッド", "スクロール進捗バー", "ダークテーマ"],
    colorPreview: ["#0a0a0f", "#00e5ff", "#e5e5e5"],
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "split-showcase",
    name: "Split Showcase",
    nameJa: "スプリット・ショーケース",
    icon: SplitSquareHorizontal,
    description:
      "左右分割画面で画像とテキストが交互に入れ替わる。フォトグラファー・ファッション系に最適。",
    features: ["左右分割レイアウト", "交互切替アニメーション", "パララックスHero"],
    colorPreview: ["#111111", "#c9a96e", "#f0ede6"],
    iconColor: "text-amber-300",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "stack-cards",
    name: "Stack Cards",
    nameJa: "スタック・カード",
    icon: Layers,
    description:
      "スクロールでカードが重なって積み上がるスタッキング効果。Apple風のリッチな体験。",
    features: ["スタッキング効果", "スケール＆フェード", "インディゴアクセント"],
    colorPreview: ["#0c0c0c", "#6366f1", "#a78bfa"],
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: "neo-brutalist",
    name: "Neo Brutalist",
    nameJa: "ネオ・ブルータリスト",
    icon: Zap,
    description:
      "太ボーダー、ビビッドカラー、巨大タイポグラフィ。角丸ゼロ、影ゼロ。意図的に大胆な反デザイン。",
    features: ["太ボーダー3-4px", "非対称グリッド", "ビビッドカラー"],
    colorPreview: ["#fffdf5", "#ff5722", "#2563eb"],
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    id: "glass-morphism",
    name: "Glass Morphism",
    nameJa: "グラス・モーフィズム",
    icon: Sparkles,
    description:
      "半透明フロストガラスカードがカラフルなグラデーション背景の上に浮かぶ。トレンド感のあるエーテリアルなデザイン。",
    features: ["backdrop-blur効果", "浮遊グラデーションオーブ", "ガラスカードUI"],
    colorPreview: ["#0f0f1a", "#8b5cf6", "#06b6d4"],
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
];

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const Icon = template.icon;
  return (
    <Link href={`/templates/${template.id}`}>
      <motion.div
        className="glow-border h-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -4 }}
      >
        <div className="relative rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-6 h-full group overflow-hidden cursor-pointer">
          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.03] to-transparent" />

        {/* Header: icon + name */}
        <div className="relative flex items-start gap-4 mb-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl border ${template.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className={`w-6 h-6 ${template.iconColor}`} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-white font-serif text-lg font-bold">{template.name}</h3>
            <p className="text-text-muted text-xs font-mono">{template.nameJa}</p>
          </div>
        </div>

        {/* Description */}
        <p className="relative text-text-secondary text-sm leading-relaxed mb-5">
          {template.description}
        </p>

        {/* Features */}
        <div className="relative flex flex-wrap gap-2 mb-5">
          {template.features.map((f) => (
            <span
              key={f}
              className="px-3 py-1 text-[10px] font-mono tracking-wider text-text-muted border border-white/[0.08] rounded-full"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Color preview + demo link */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-[10px] font-mono mr-1">COLORS</span>
            {template.colorPreview.map((color) => (
              <div
                key={color}
                className="w-5 h-5 rounded-full border border-white/10"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-primary font-mono text-[11px] tracking-wider group-hover:underline underline-offset-4">
            <ExternalLink className="w-3.5 h-3.5" />
            Demo
          </span>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

export default function TemplatesPage() {
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-sm font-bold text-white tracking-wide">
                しくみや
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-text-secondary group-hover:text-primary transition-colors">
                by Lyo Vision
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="font-mono text-xs text-text-secondary hover:text-primary transition-colors tracking-wider"
          >
            ← Back to Top
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="max-w-[1100px] mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              title="TEMPLATES"
              subtitle="Claude Codeで作った、プロ品質のポートフォリオテンプレート"
            />
          </motion.div>

          <motion.p
            className="text-text-secondary max-w-[640px] text-sm leading-relaxed mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            プロのデザイナーサイトを分析し、その構造を再現したテンプレート集。
            すべてClaude Codeだけで実装しています。
            コードが書けなくても、自分だけのポートフォリオサイトが作れます。
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.05] text-primary font-mono text-[11px] tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {templates.length} Templates
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400 font-mono text-[11px] tracking-wider">
              FREE
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.02] text-text-secondary font-mono text-[11px] tracking-wider">
              Next.js + Tailwind CSS
            </span>
          </motion.div>
        </section>

        {/* Template Grid */}
        <section className="max-w-[1100px] mx-auto px-6 mb-24">
          <div className="grid md:grid-cols-2 gap-5">
            {templates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </section>

        {/* Before / After */}
        <section className="max-w-[1100px] mx-auto px-6 mb-24">
          <motion.div
            className="glow-border"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-8 sm:p-12">
              <div className="grid sm:grid-cols-2 gap-8 items-center">
                {/* Before */}
                <div className="text-center">
                  <div className="w-full aspect-video rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2 opacity-30">🖥️</div>
                      <p className="text-text-muted text-xs font-mono">サイトがない状態</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
                    Before
                  </span>
                </div>

                {/* After */}
                <div className="text-center">
                  <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-primary/10 via-violet-500/10 to-amber-500/10 border border-primary/20 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">✨</div>
                      <p className="text-primary text-xs font-mono">
                        プロ品質のポートフォリオ
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-primary tracking-widest uppercase">
                    After — built with Claude Code
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/[0.06] text-center">
                <p className="text-text-secondary text-sm mb-2">
                  プロのサイトを分析 → テンプレートに落とし込み → 自分仕様に編集
                </p>
                <p className="text-text-muted text-xs">
                  作り方の詳しい手順はnote記事で公開しています
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold mb-4">
              自分のサイトも作りたい？
            </h3>
            <p className="text-text-secondary text-sm mb-8 leading-relaxed">
              テンプレートの選び方から、自分仕様への編集、デプロイまで。
              手順をすべてnote記事にまとめています。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://note.com/ando_lyo_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary/10 border border-primary/40 text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/20 hover:border-primary/60 transition-all duration-300"
              >
                noteで作り方を読む →
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/[0.1] text-text-secondary font-mono text-xs tracking-widest uppercase hover:border-white/[0.2] hover:text-white transition-all duration-300"
              >
                トップに戻る
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center">
        <p className="text-text-muted text-xs font-mono">
          &copy; 2026 Lyo Vision. All rights reserved.
        </p>
      </footer>
    </>
  );
}
