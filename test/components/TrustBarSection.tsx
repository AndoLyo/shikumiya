"use client";

import { motion } from "framer-motion";
import { Clock, BookOpen, Eye } from "lucide-react";

const stats = [
  { icon: Clock, value: "月40時間", desc: "の作業を自動化", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: BookOpen, value: "開発日記", desc: "をnoteで連載中", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Eye, value: "すべて公開", desc: "失敗も含めて共有", color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

export default function TrustBarSection() {
  return (
    <section className="relative py-8 md:py-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Subtle geometric lines (moufdesign inspired) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.value}
                className="flex items-center gap-4 justify-center sm:justify-start group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className={`w-11 h-11 rounded-xl ${stat.bg} border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
                </div>
                <p className="text-sm text-text-secondary">
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
