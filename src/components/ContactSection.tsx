"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const actions = [
  {
    title: "noteで記事を読む",
    desc: "開発日記・チュートリアル・プロンプト集を無料で公開中",
    href: "https://note.com/ando_lyo_ai",
    cta: "noteを見る",
    color: "border-primary/30 hover:border-primary",
    ctaColor: "text-primary",
    comingSoon: false,
  },
  {
    title: "メンバーシップに参加",
    desc: "限定記事・自動化スクリプト・Q&Aで、あなたの仕組み作りを加速",
    href: "https://note.com/ando_lyo_ai/membership",
    cta: "メンバーシップを見る",
    color: "border-gold/30 hover:border-gold",
    ctaColor: "text-gold",
    comingSoon: false,
  },
  {
    title: "Discordコミュニティ",
    desc: "AI自動化に興味がある人の情報交換・相談の場",
    href: "#",
    cta: "Coming Soon",
    color: "border-text-muted/20",
    ctaColor: "text-text-muted",
    comingSoon: true,
  },
  {
    title: "お仕事の相談・お問い合わせ",
    desc: "エージェント設計の依頼・コラボレーション・取材などお気軽に",
    href: "mailto:ando.lyo.ai@gmail.com",
    cta: "メールで問い合わせ",
    color: "border-primary/30 hover:border-primary",
    ctaColor: "text-primary",
    comingSoon: false,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-[#0d0d12]">
      <div className="max-w-[900px] mx-auto px-6">
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

        <div className="grid sm:grid-cols-2 gap-6">
          {actions.map((a, i) => {
            const isDisabled = a.comingSoon;
            const Wrapper = isDisabled ? motion.div : motion.a;
            const linkProps = isDisabled
              ? {}
              : {
                  href: a.href,
                  target: a.href.startsWith("mailto:") ? undefined : "_blank",
                  rel: a.href.startsWith("mailto:") ? undefined : "noopener noreferrer",
                };
            return (
              <Wrapper
                key={a.title}
                {...(linkProps as Record<string, unknown>)}
                className={`glass-card p-6 flex flex-col border transition-all duration-300 group relative ${a.color} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={isDisabled ? {} : { y: -4 }}
              >
                {isDisabled && (
                  <span className="absolute -top-2 right-4 px-3 py-0.5 bg-text-muted/30 text-text-muted font-mono text-[9px] tracking-widest uppercase">
                    Coming Soon
                  </span>
                )}
                <h4 className="font-serif text-white text-base font-semibold mb-2">
                  {a.title}
                </h4>
                <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1">
                  {a.desc}
                </p>
                <span className={`font-mono text-xs tracking-wider ${a.ctaColor} ${!isDisabled ? "group-hover:underline underline-offset-4" : ""}`}>
                  → {a.cta}
                </span>
              </Wrapper>
            );
          })}
        </div>

        {/* Social links */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-4 text-text-muted text-sm font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a href="https://x.com/ando_lyo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            X
          </a>
          <span className="text-primary/30">|</span>
          <a href="https://github.com/ando-lyo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <span className="text-primary/30">|</span>
          <a href="https://www.instagram.com/ando_lyo_ai/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
