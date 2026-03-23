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
  { value: 500, suffix: "回+", label: "有料記事 購入数" },
  { value: 56, suffix: "本", label: "note記事 公開数" },
  { value: 24, suffix: "体", label: "AIエージェント構築" },
  { value: 300, suffix: "h+", label: "Hires.fix 検証時間" },
];

const achievements = [
  {
    title: "Easy Prompt Selector対応プロンプト集",
    desc: "3万文字超のYAMLファイル・100カテゴリ以上を収録。累計250回以上購入された人気コンテンツ",
    tag: "250回購入",
    url: "https://note.com/ando_lyo_ai/n/n6137781e8dce",
    color: "text-gold",
  },
  {
    title: "Hires.fix設定の黄金比",
    desc: "300時間以上の検証データから導き出した「溶けない」最適設定を体系化",
    tag: "300h検証",
    url: "https://note.com/ando_lyo_ai/n/nd2a696b8f901",
    color: "text-primary",
  },
  {
    title: "noteコンテンツ 56記事公開",
    desc: "AIアートプロンプト集・開発日記・チュートリアルの3マガジンで継続発信",
    tag: "56記事",
    url: "https://note.com/ando_lyo_ai",
    color: "text-gold",
  },
  {
    title: "AI Art Creation Lab メンバーシップ運営",
    desc: "月額制メンバーシップを運営。限定記事16本+掲示板でメンバーをサポート",
    tag: "運営中",
    url: "https://note.com/ando_lyo_ai/membership",
    color: "text-primary",
  },
];

const skills = [
  {
    category: "AI画像生成",
    items: ["Midjourney", "Stable Diffusion", "DALL-E", "Flux", "Magnific AI"],
    color: "text-primary",
  },
  {
    category: "プロンプト設計",
    items: ["構造化プロンプト", "BREAK構文", "カラーコントロール", "Hires.fix最適化", "ネガティブプロンプト"],
    color: "text-gold",
  },
  {
    category: "開発・自動化",
    items: ["Claude Code", "Python", "GAS", "Flask", "タスクスケジューラ"],
    color: "text-primary",
  },
  {
    category: "コンテンツ制作",
    items: ["note記事執筆", "サムネイル設計", "SEO最適化", "メンバーシップ運営"],
    color: "text-gold",
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
