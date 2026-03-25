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
  borderColor: string;
  iconBg: string;
}[] = [
  {
    icon: FileText,
    title: "記事制作の自動化",
    description: "構成→執筆→SEO→サムネイル→公開まで、AIエージェントがパイプラインで処理。あなたはテーマを決めるだけ。",
    color: "text-cyan-400",
    borderColor: "group-hover:border-cyan-500/30",
    iconBg: "bg-cyan-500/10",
  },
  {
    icon: Share2,
    title: "SNS投稿の自動化",
    description: "Instagram・Threads・Xへの投稿文生成からスケジュール投稿まで。プラットフォームごとの最適化もAIが判断。",
    color: "text-violet-400",
    borderColor: "group-hover:border-violet-500/30",
    iconBg: "bg-violet-500/10",
  },
  {
    icon: Palette,
    title: "サムネイル設計の自動化",
    description: "記事の内容を読み取り、クリック率の高いサムネイルをAIが設計。プロンプト生成まで一気通貫。",
    color: "text-rose-400",
    borderColor: "group-hover:border-rose-500/30",
    iconBg: "bg-rose-500/10",
  },
  {
    icon: Search,
    title: "SEO・タイトル最適化",
    description: "タイトル案・ハッシュタグ・冒頭文をAIが複数パターン生成。数字に基づいた改善提案も。",
    color: "text-emerald-400",
    borderColor: "group-hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: Bot,
    title: "24体のAIエージェント",
    description: "制作部・編集部・広報部・経営企画部。役割ごとに専門化したAIが連携して、1人分以上の仕事をこなす。",
    color: "text-amber-400",
    borderColor: "group-hover:border-amber-500/30",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: BookOpen,
    title: "すべてをオープンに公開",
    description: "仕組みの設計図・コード・失敗談まで全部見せる。あなたが同じ仕組みを作るためのドキュメントを提供。",
    color: "text-sky-400",
    borderColor: "group-hover:border-sky-500/30",
    iconBg: "bg-sky-500/10",
  },
];

export default function PillarsSection() {
  return (
    <section id="solution" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/portfolio/work_19.webp"
          alt=""
          fill
          className="object-cover opacity-[0.07]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/90" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading title="SOLUTION" subtitle="しくみやが解決すること" align="center" />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-14 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          AIの力を借りて、コンテンツ制作のあらゆる工程を仕組み化。
          あなたは「何を伝えるか」に集中できます。
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                className={`group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-500 hover:bg-white/[0.04] ${s.borderColor}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg ${s.iconBg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${s.color}`} strokeWidth={1.5} />
                </div>

                <h3 className="text-white font-bold text-sm mb-2">{s.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{s.description}</p>

                {/* Subtle corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-xl bg-gradient-to-bl ${s.iconBg} to-transparent`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
