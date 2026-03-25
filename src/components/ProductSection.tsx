"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: "📱",
    title: "マルチプラットフォーム対応",
    description: "Instagram・Threads・Xへの投稿を一括管理。プラットフォームごとの最適化も自動。",
  },
  {
    icon: "🤖",
    title: "AI自動生成",
    description: "投稿文・ハッシュタグ・リプライをAIが自動生成。あなたのトーンに合わせて学習。",
  },
  {
    icon: "📅",
    title: "スケジュール投稿",
    description: "最適な投稿タイミングを分析し、予約投稿。寝ている間もSNSが動き続ける。",
  },
  {
    icon: "📊",
    title: "開発過程をすべて公開",
    description: "このアプリの設計・実装・失敗もnoteで全記録。あなた自身のアプリ開発の参考に。",
  },
];

export default function ProductSection() {
  return (
    <section id="product" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6">
        <SectionHeading title="PRODUCT" subtitle="SNS AutoControl App" align="center" />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-4 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          SNS運用を自動化するアプリを開発中。
          3つのプラットフォームを1つのダッシュボードで管理し、
          投稿・リプライ・分析まですべてAIが担当します。
        </motion.p>

        <motion.p
          className="text-center text-primary font-mono text-xs tracking-widest uppercase mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Currently in Development — 開発過程をnoteで公開中
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card p-6 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-2xl flex-shrink-0">{f.icon}</div>
              <div>
                <h4 className="text-white font-bold text-sm mb-2">{f.title}</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://note.com/ando_lyo_ai/m/m3294daf5f300"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 border border-primary/40 text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/10 transition-all"
          >
            開発日記を読む →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
