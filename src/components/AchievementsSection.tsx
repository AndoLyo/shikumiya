"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
}

function AnimatedStat({ value, suffix, label, delay = 0 }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1500;
      const increment = value / (duration / 16);
      const interval = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-4xl sm:text-5xl font-bold text-primary glow-text">
        {count}
        <span className="text-2xl">{suffix}</span>
      </div>
      <p className="mt-2 font-mono text-text-muted text-xs tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}

const stats = [
  { value: 50, suffix: "万円", label: "note売上（半年）" },
  { value: 500, suffix: "回+", label: "有料記事 購入数" },
  { value: 24, suffix: "体", label: "AIエージェント構築" },
  { value: 70, suffix: "%", label: "利益率" },
];

const achievements = [
  {
    title: "note売上 半年で50万円達成",
    desc: "有料記事とメンバーシップの組み合わせで利益率70%を実現",
    tag: "50万円",
    url: "https://note.com/ando_lyo_ai",
    color: "text-gold",
  },
  {
    title: "Easy Prompt Selector対応プロンプト集",
    desc: "3万文字超のYAMLファイル・100カテゴリ以上を収録。累計250回以上購入された人気コンテンツ",
    tag: "250回購入",
    url: "https://note.com/ando_lyo_ai/n/n6137781e8dce",
    color: "text-primary",
  },
  {
    title: "24体AIエージェントシステム構築",
    desc: "Claude Codeで構築した自律型エージェント。記事制作・SNS投稿・サムネ設計まで全自動化",
    tag: "24体稼働",
    url: "https://note.com/ando_lyo_ai/m/m3294daf5f300",
    color: "text-gold",
  },
  {
    title: "Hires.fix設定の黄金比",
    desc: "300時間以上の検証データから導き出した「溶けない」最適設定を体系化",
    tag: "300h検証",
    url: "https://note.com/ando_lyo_ai/n/nd2a696b8f901",
    color: "text-primary",
  },
];

const skills = [
  {
    category: "AI自動化・エージェント",
    items: ["Claude Code", "24体AIエージェント", "GAS", "Python", "Flask"],
    color: "text-gold",
  },
  {
    category: "SNS・コンテンツ自動化",
    items: ["SNS AutoControl App", "note自動執筆", "サムネイル自動設計", "SEO最適化", "メンバーシップ運営"],
    color: "text-primary",
  },
  {
    category: "AI画像生成",
    items: ["Midjourney", "Stable Diffusion", "DALL-E", "Flux", "Magnific AI"],
    color: "text-gold",
  },
  {
    category: "プロンプト設計",
    items: ["構造化プロンプト", "BREAK構文", "カラーコントロール", "Hires.fix最適化", "ネガティブプロンプト"],
    color: "text-primary",
  },
];

export default function AchievementsSection() {
  return (
    <section id="achievements" className="section-padding">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading title="TRACK RECORD" subtitle="実績とスキル" align="center" />

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((s, i) => (
            <AnimatedStat
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              delay={i * 150}
            />
          ))}
        </div>

        {/* Achievements */}
        <div className="max-w-[900px] mx-auto mb-16">
          {achievements.map((a, i) => (
            <motion.a
              key={a.title}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 py-5 border-b border-border/30 group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex-1">
                <h4 className={`font-serif text-base sm:text-lg font-semibold group-hover:brightness-125 transition-all ${a.color}`}>
                  {a.title}
                </h4>
                <p className="text-text-muted text-xs sm:text-sm mt-1">
                  {a.desc}
                </p>
              </div>
              <span className="flex-shrink-0 px-3 py-1 text-[10px] font-mono tracking-widest bg-primary/10 text-primary">
                {a.tag}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-[900px] mx-auto">
          {skills.map((group, i) => (
            <motion.div
              key={group.category}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h4 className={`font-serif text-lg font-semibold mb-4 ${group.color}`}>
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-xs font-mono text-text-secondary border border-border/30 bg-white/5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
