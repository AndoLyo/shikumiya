"use client";

import { motion } from "framer-motion";
import { Smartphone, Bot, CalendarClock, Code2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  iconBg: string;
}[] = [
  {
    icon: Smartphone,
    title: "マルチプラットフォーム対応",
    description:
      "Instagram・Threads・Xへの投稿を一括管理。プラットフォームごとの最適化も自動。",
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Bot,
    title: "AI自動生成",
    description:
      "投稿文・ハッシュタグ・リプライをAIが自動生成。あなたのトーンに合わせて学習。",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: CalendarClock,
    title: "スケジュール投稿",
    description:
      "最適な投稿タイミングを分析し、予約投稿。寝ている間もSNSが動き続ける。",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Code2,
    title: "開発過程をすべて公開",
    description:
      "このアプリの設計・実装・失敗もnoteで全記録。あなた自身のアプリ開発の参考に。",
    color: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
];

export default function ProductSection() {
  return (
    <section
      id="product"
      className="relative section-padding overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/portfolio/work_15.webp"
          alt=""
          fill
          className="object-cover opacity-[0.08]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a12]/95 to-[#0a0a0f]" />
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <SectionHeading
          title="SNS自動管理アプリ"
          subtitle="3つのSNSを1つのダッシュボードで管理し、投稿・リプライ・分析まですべてAIが担当"
          number="— 03"
          align="center"
        />

        {/* Status badge */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-primary/20 bg-primary/[0.05]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-primary text-xs tracking-widest">
              現在開発中
            </span>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className="glow-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="relative rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-7 flex gap-5 h-full group overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.02] to-transparent" />

                  {/* Icon */}
                  <div
                    className={`relative flex-shrink-0 w-12 h-12 rounded-xl border ${f.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon
                      className={`w-6 h-6 ${f.color}`}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="relative">
                    <h4 className="text-white font-bold text-sm mb-2">
                      {f.title}
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Template showcase link */}
        <motion.div
          className="mt-10 glow-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/templates"
            className="block rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-6 sm:p-7 group overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-violet-500/[0.03] to-transparent" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-0.5 text-[10px] tracking-widest text-emerald-400 bg-emerald-500/10 rounded-full">
                    無料
                  </span>
                  <span className="px-3 py-0.5 text-[10px] tracking-widest text-violet-400 bg-violet-500/10 rounded-full">
                    10種類
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm sm:text-base group-hover:text-primary transition-colors">
                  ポートフォリオテンプレート集
                </h4>
                <p className="text-text-muted text-xs mt-1">
                  プロのサイトを分析→再現。Claude
                  Codeだけで作ったテンプレートを無料公開
                </p>
              </div>
              <span className="text-primary text-xs tracking-wider flex-shrink-0 hidden sm:block group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://note.com/ando_lyo_ai/m/m3294daf5f300"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-primary/30 text-primary text-xs tracking-widest hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
          >
            開発日記を読む →
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
