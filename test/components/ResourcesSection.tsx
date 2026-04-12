"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";

const categories = [
  { id: "dev", label: "開発日記" },
  { id: "tutorial", label: "チュートリアル" },
  { id: "prompt", label: "プロンプト集" },
];

interface Resource {
  category: string;
  title: string;
  subtitle: string;
  type: "free" | "paid" | "member";
  url: string;
}

const resources: Resource[] = [
  {
    category: "dev",
    title: "#0 なぜAIに仕事を任せようと思ったのか",
    subtitle: "開発日記のはじまり — 仕組み化の原点",
    type: "free",
    url: "https://note.com/ando_lyo_ai/n/nfdd8093d0b87",
  },
  {
    category: "dev",
    title: "#1 Claude Codeの始め方",
    subtitle: "黒い画面は怖くない — 初心者向け完全ガイド",
    type: "free",
    url: "https://note.com/ando_lyo_ai/n/n9d25ef9f4e27",
  },
  {
    category: "dev",
    title: "開発日記マガジン",
    subtitle: "AIで何か作ってみる開発日記 — まとめ読み",
    type: "free",
    url: "https://note.com/ando_lyo_ai/m/m3294daf5f300",
  },
  {
    category: "tutorial",
    title: "Claude Code セットアップ",
    subtitle: "黒い画面は怖くない — 初心者向け完全ガイド",
    type: "free",
    url: "https://note.com/ando_lyo_ai/n/n9d25ef9f4e27",
  },
  {
    category: "prompt",
    title: "Hires.fix設定の黄金比",
    subtitle: "300時間検証のデータをすべて公開",
    type: "paid",
    url: "https://note.com/ando_lyo_ai/n/nd2a696b8f901",
  },
  {
    category: "prompt",
    title: "BREAK構文で色移りを防ぐ",
    subtitle: "色移り防止テクニックとBREAK構文の完全ガイド",
    type: "paid",
    url: "https://note.com/ando_lyo_ai/n/nd419a4f047e2",
  },
  {
    category: "prompt",
    title: "なぜ理想の画像が出ないのか",
    subtitle: "理想の絵が出ない本当の理由",
    type: "free",
    url: "https://note.com/ando_lyo_ai/n/n8b91c6c8d1ef",
  },
  {
    category: "prompt",
    title: "プロンプト集マガジン",
    subtitle: "画像生成AIプロンプト集 — まとめてチェック",
    type: "free",
    url: "https://note.com/ando_lyo_ai/m/m039aea8b90ac",
  },
];

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  free: { bg: "bg-primary/10", text: "text-primary", label: "FREE" },
  paid: { bg: "bg-gold/10", text: "text-gold", label: "PAID" },
  member: { bg: "bg-danger/10", text: "text-danger", label: "MEMBER" },
};

export default function ResourcesSection() {
  const [active, setActive] = useState("dev");
  const filtered = resources.filter((r) => r.category === active);

  return (
    <section id="resources" className="relative section-padding overflow-hidden">
      {/* Anthropic Learn inspired section with subtle color tint */}
      <div className="absolute inset-0 bg-[#0b0b12]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading
          title="RESOURCES"
          subtitle="今すぐ読めるコンテンツ"
          align="center"
        />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-10 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          仕組み作りの過程をすべて記録したnote記事。
          開発日記で流れを掴み、チュートリアルで手を動かし、プロンプト集で素材を手に入れる。
        </motion.p>

        {/* Category tabs - Anthropic Learn clean button style */}
        <div className="flex justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-5 py-2.5 rounded-lg font-mono text-xs tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
                active === cat.id
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "border-white/[0.08] text-text-muted hover:border-primary/30 hover:text-text-secondary"
              }`}
              data-cursor="pointer"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resource list with AnimatePresence for smooth transitions */}
        <div className="grid gap-3 max-w-[800px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid gap-3"
            >
              {filtered.map((res, i) => {
                const tc = typeColors[res.type];
                return (
                  <motion.a
                    key={res.title}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-5 flex items-center justify-between gap-4 hover:border-primary/30 transition-all group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    data-cursor="pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm sm:text-base font-medium group-hover:text-primary transition-colors truncate">
                        {res.title}
                      </h4>
                      <p className="text-text-muted text-xs mt-1 truncate">
                        {res.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex-shrink-0 px-3 py-1 rounded text-[10px] font-mono tracking-widest ${tc.bg} ${tc.text}`}
                      >
                        {tc.label}
                      </span>
                      <svg
                        className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8H13M13 8L9 4M13 8L9 12"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://note.com/ando_lyo_ai"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-primary/40 text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/10 transition-all"
            data-cursor="pointer"
          >
            すべての記事を見る
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
