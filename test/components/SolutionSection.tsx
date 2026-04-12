"use client";

import { motion } from "framer-motion";
import { FileText, Share2, Palette, Search, Bot, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const solutions: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  iconBg: string;
  // Anthropic Learn inspired section tint colors on dark background
  cardTint: string;
  span?: string;
  image?: string;
}[] = [
  {
    icon: FileText,
    title: "記事制作の自動化",
    description:
      "構成→執筆→SEO→サムネイル→公開まで、AIエージェントがパイプラインで処理。あなたはテーマを決めるだけ。",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    cardTint: "from-cyan-500/[0.04] to-transparent",
    span: "sm:col-span-2",
    image: "/portfolio/work_06.webp",
  },
  {
    icon: Share2,
    title: "SNS投稿の自動化",
    description:
      "Instagram・Threads・Xへの投稿文生成からスケジュール投稿まで。プラットフォームごとの最適化もAIが判断。",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10",
    cardTint: "from-violet-500/[0.04] to-transparent",
  },
  {
    icon: Palette,
    title: "サムネイル設計",
    description:
      "記事の内容を読み取り、クリック率の高いサムネイルをAIが設計。プロンプト生成まで一気通貫。",
    color: "text-rose-400",
    iconBg: "bg-rose-500/10",
    cardTint: "from-rose-500/[0.04] to-transparent",
  },
  {
    icon: Search,
    title: "SEO・タイトル最適化",
    description:
      "タイトル案・ハッシュタグ・冒頭文をAIが複数パターン生成。数字に基づいた改善提案も。",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    cardTint: "from-emerald-500/[0.04] to-transparent",
  },
  {
    icon: Bot,
    title: "24体のAIエージェント",
    description:
      "制作部・編集部・広報部・経営企画部。役割ごとに専門化したAIが連携して、1人分以上の仕事をこなす。",
    color: "text-amber-400",
    iconBg: "bg-amber-500/10",
    cardTint: "from-amber-500/[0.04] to-transparent",
    span: "sm:col-span-2",
    image: "/portfolio/work_11.webp",
  },
  {
    icon: BookOpen,
    title: "すべてをオープンに公開",
    description:
      "仕組みの設計図・コード・失敗談まで全部見せる。あなたが同じ仕組みを作るためのドキュメントを提供。",
    color: "text-sky-400",
    iconBg: "bg-sky-500/10",
    cardTint: "from-sky-500/[0.04] to-transparent",
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#080810]" />
      <div className="absolute inset-0 mesh-gradient-2" />

      {/* Geometric decoration */}
      <div className="absolute top-16 left-[3%] w-20 h-20 border border-primary/[0.03] rotate-45" />
      <div className="absolute bottom-24 right-[6%] w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[31px] border-b-gold/[0.04]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading
          title="SOLUTION"
          subtitle="しくみやが解決すること"
          align="center"
        />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-14 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          AIの力を借りて、コンテンツ制作のあらゆる工程を仕組み化。
          あなたは「何を伝えるか」に集中できます。
        </motion.p>

        {/* Bento Grid with Anthropic Learn color tints */}
        <div className="grid sm:grid-cols-3 gap-4">
          {solutions.map((s, i) => {
            const Icon = s.icon;
            const hasImage = !!s.image;
            return (
              <motion.div
                key={s.title}
                className={`group relative rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-500 hover:border-white/[0.15] ${s.span || ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {/* Background image for featured cards */}
                {hasImage && (
                  <div className="absolute inset-0">
                    <Image
                      src={s.image!}
                      alt=""
                      fill
                      className="object-cover opacity-[0.1] group-hover:opacity-[0.18] transition-all duration-700 scale-105 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  </div>
                )}

                {/* Card tint gradient (Anthropic Learn section color influence) */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${s.cardTint} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div
                  className={`relative z-10 p-7 sm:p-8 h-full ${
                    hasImage
                      ? "bg-[#0d0d15]/60 backdrop-blur-sm"
                      : "bg-[#0d0d15]/40"
                  }`}
                >
                  {/* Icon with hover animation */}
                  <div
                    className={`w-12 h-12 rounded-xl ${s.iconBg} border border-white/[0.08] flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:border-white/[0.12]`}
                  >
                    <Icon className={`w-6 h-6 ${s.color}`} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-white font-bold text-base mb-2">
                    {s.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {s.description}
                  </p>

                  {/* Arrow indicator on hover (Anthropic Learn card style) */}
                  <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                    <span className={`text-xs font-mono ${s.color}`}>
                      Learn more
                    </span>
                    <svg className={`w-3 h-3 ${s.color}`} viewBox="0 0 12 12" fill="none">
                      <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
