"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const actions = [
  {
    title: "noteで記事を読む",
    desc: "AIアートのプロンプト集・チュートリアル・開発日記を公開中",
    href: "https://note.com/ando_lyo_ai",
    cta: "noteを見る",
    color: "border-primary/30 hover:border-primary",
    ctaColor: "text-primary",
  },
  {
    title: "Lab Memberに参加",
    desc: "限定プロンプト・先行公開記事・掲示板でのQ&Aにアクセス",
    href: "https://note.com/ando_lyo_ai/membership",
    cta: "メンバーシップを見る",
    color: "border-gold/30 hover:border-gold",
    ctaColor: "text-gold",
  },
  {
    title: "お仕事の相談・お問い合わせ",
    desc: "プロンプト設計の依頼・コラボレーション・取材などお気軽に",
    href: "mailto:ando.lyo.ai@gmail.com",
    cta: "メールで問い合わせ",
    color: "border-primary/30 hover:border-primary",
    ctaColor: "text-primary",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-[#0d0d12]">
      <div className="max-w-[900px] mx-auto px-6">
        <SectionHeading title="CONTACT" subtitle="お問い合わせ・つながる" align="center" />

        <motion.p
          className="text-center text-text-secondary max-w-[500px] mx-auto mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          AIアートやプロンプト設計について、
          記事の感想・お仕事の相談、なんでもお気軽にどうぞ。
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-6">
          {actions.map((a, i) => (
            <motion.a
              key={a.title}
              href={a.href}
              target={a.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={a.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className={`glass-card p-6 flex flex-col border transition-all duration-300 group ${a.color}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <h4 className="font-serif text-white text-base font-semibold mb-2">
                {a.title}
              </h4>
              <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1">
                {a.desc}
              </p>
              <span className={`font-mono text-xs tracking-wider ${a.ctaColor} group-hover:underline underline-offset-4`}>
                → {a.cta}
              </span>
            </motion.a>
          ))}
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
