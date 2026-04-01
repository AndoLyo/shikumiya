"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const articles = [
  {
    title: "#0 なぜAIに仕事を任せようと思ったのか",
    desc: "開発日記のはじまり — 仕組み化の原点",
    url: "https://note.com/ando_lyo_ai/n/nfdd8093d0b87",
    tag: "無料",
    tagColor: "text-primary bg-primary/10",
  },
  {
    title: "#1 Claude Codeの始め方",
    desc: "黒い画面は怖くない — 初心者向け完全ガイド",
    url: "https://note.com/ando_lyo_ai/n/n9d25ef9f4e27",
    tag: "無料",
    tagColor: "text-primary bg-primary/10",
  },
  {
    title: "開発日記マガジン",
    desc: "AIで何か作ってみる開発日記 — まとめ読み",
    url: "https://note.com/ando_lyo_ai/m/m3294daf5f300",
    tag: "無料",
    tagColor: "text-primary bg-primary/10",
  },
  {
    title: "Hires.fix設定の黄金比",
    desc: "300時間検証のデータをすべて公開",
    url: "https://note.com/ando_lyo_ai/n/nd2a696b8f901",
    tag: "有料",
    tagColor: "text-gold bg-gold/10",
  },
];

export default function ResourcesSection() {
  return (
    <section id="resources" className="section-padding bg-[#0d0d12]">
      <div className="max-w-[900px] mx-auto px-6">
        <SectionHeading
          title="制作過程を公開中"
          subtitle="サイトの作り方・AI活用・失敗談まで、noteで全記録しています。"
          number="— 04"
          align="center"
        />

        <div className="grid gap-3 max-w-[700px] mx-auto">
          {articles.map((a, i) => (
            <motion.a
              key={a.title}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 flex items-center justify-between gap-4 hover:border-primary/30 transition-all group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium group-hover:text-primary transition-colors truncate">
                  {a.title}
                </h4>
                <p className="text-text-muted text-xs mt-1 truncate">
                  {a.desc}
                </p>
              </div>
              <span
                className={`flex-shrink-0 px-3 py-1 text-[10px] tracking-widest rounded-full ${a.tagColor}`}
              >
                {a.tag}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://note.com/ando_lyo_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary/30 text-primary text-xs tracking-widest hover:bg-primary/10 transition-all"
          >
            すべての記事を見る →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
