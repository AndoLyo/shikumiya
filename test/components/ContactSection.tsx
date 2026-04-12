"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, MessageCircle, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const actions: {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
  cta: string;
  iconColor: string;
  iconBg: string;
  // Anthropic Learn section card color
  hoverTint: string;
  comingSoon: boolean;
}[] = [
  {
    icon: BookOpen,
    title: "noteで記事を読む",
    desc: "開発日記・チュートリアル・プロンプト集を無料で公開中",
    href: "https://note.com/ando_lyo_ai",
    cta: "noteを見る",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    hoverTint: "group-hover:bg-cyan-500/[0.03]",
    comingSoon: false,
  },
  {
    icon: Users,
    title: "メンバーシップに参加",
    desc: "限定記事・自動化スクリプト・Q&Aで、あなたの仕組み作りを加速",
    href: "https://note.com/ando_lyo_ai/membership",
    cta: "メンバーシップを見る",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    hoverTint: "group-hover:bg-amber-500/[0.03]",
    comingSoon: false,
  },
  {
    icon: MessageCircle,
    title: "Discordコミュニティ",
    desc: "AI自動化に興味がある人の情報交換・相談の場",
    href: "#",
    cta: "Coming Soon",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    hoverTint: "",
    comingSoon: true,
  },
  {
    icon: Mail,
    title: "お仕事の相談・お問い合わせ",
    desc: "エージェント設計の依頼・コラボレーション・取材などお気軽に",
    href: "mailto:ando.lyo.ai@gmail.com",
    cta: "メールで問い合わせ",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    hoverTint: "group-hover:bg-emerald-500/[0.03]",
    comingSoon: false,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/portfolio/work_20.webp"
          alt=""
          fill
          className="object-cover opacity-[0.05]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/95" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <SectionHeading title="CONTACT" subtitle="次のステップを選ぶ" align="center" />

        <motion.p
          className="text-center text-text-secondary max-w-[500px] mx-auto mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          仕組み作りを始めたい方も、まず記事を読んでみたい方も。
          あなたに合ったスタート地点を選んでください。
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-5">
          {actions.map((a, i) => {
            const isDisabled = a.comingSoon;
            const Icon = a.icon;

            const cardContent = (
              <div
                className={`relative rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-6 h-full group overflow-hidden transition-all duration-500 ${a.hoverTint} ${
                  isDisabled ? "" : "hover:border-white/[0.12]"
                }`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl" />

                {isDisabled && (
                  <span className="absolute top-3 right-4 px-3 py-0.5 rounded-full bg-white/[0.05] text-text-muted font-mono text-[9px] tracking-widest uppercase">
                    Coming Soon
                  </span>
                )}

                <div
                  className={`relative w-10 h-10 rounded-lg ${a.iconBg} border border-white/[0.06] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-5 h-5 ${a.iconColor}`} strokeWidth={1.5} />
                </div>

                <h4 className="relative font-serif text-white text-base font-semibold mb-2">
                  {a.title}
                </h4>
                <p className="relative text-text-muted text-xs leading-relaxed mb-4">
                  {a.desc}
                </p>
                <span
                  className={`relative font-mono text-xs tracking-wider flex items-center gap-1 ${
                    isDisabled
                      ? "text-text-muted"
                      : "text-primary group-hover:gap-2 transition-all duration-300"
                  }`}
                >
                  <span>→ {a.cta}</span>
                </span>
              </div>
            );

            if (isDisabled) {
              return (
                <motion.div
                  key={a.title}
                  className="glow-border opacity-50 cursor-not-allowed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 0.5, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  {cardContent}
                </motion.div>
              );
            }

            return (
              <motion.a
                key={a.title}
                href={a.href}
                target={a.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={a.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="glow-border block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                data-cursor="pointer"
              >
                {cardContent}
              </motion.a>
            );
          })}
        </div>

        {/* Social links */}
        <motion.div
          className="mt-14 flex items-center justify-center gap-6 text-text-muted text-sm font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="https://x.com/ando_lyo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
            data-cursor="pointer"
          >
            X
          </a>
          <span className="w-1 h-1 rounded-full bg-primary/30" />
          <a
            href="https://github.com/ando-lyo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
            data-cursor="pointer"
          >
            GitHub
          </a>
          <span className="w-1 h-1 rounded-full bg-primary/30" />
          <a
            href="https://www.instagram.com/ando_lyo_ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-300"
            data-cursor="pointer"
          >
            Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
