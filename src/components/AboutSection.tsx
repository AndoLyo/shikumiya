"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

// Animated counter hook
function useCounter(target: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);
  return count;
}

const stats = [
  { value: 24, suffix: "体", label: "AIエージェント稼働中", color: "text-cyan-400" },
  { value: 50, suffix: "万", label: "note売上（半年）", prefix: "¥", color: "text-amber-400" },
  { value: 70, suffix: "%", label: "利益率", color: "text-emerald-400" },
  { value: 500, suffix: "+", label: "有料記事の購入回数", color: "text-violet-400" },
];

function StatCard({ stat, delay }: { stat: typeof stats[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCounter(stat.value, 2000, isInView);

  return (
    <motion.div
      ref={ref}
      className="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 text-center group hover:border-white/[0.12] transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`font-serif text-3xl font-bold ${stat.color}`}>
        {stat.prefix || ""}{count}{stat.suffix}
      </div>
      <div className="text-text-muted text-xs mt-1">{stat.label}</div>
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/portfolio/work_03.webp"
          alt=""
          fill
          className="object-cover opacity-[0.08]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/90" />
        <div className="absolute inset-0 mesh-gradient-2" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left: Key visual */}
          <motion.div
            className="w-full lg:w-[40%] flex-shrink-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[3/4] max-h-[500px] mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <Image
                src="/portfolio/about.webp"
                alt="Lyo key visual"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
              {/* Glow border effect */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>

          {/* Right: Text */}
          <div className="w-full lg:w-[60%]">
            <SectionHeading title="ABOUT" subtitle="なぜ、この情報を信頼できるのか" />

            <motion.p
              className="text-text-secondary leading-[1.8] mb-6 text-[15px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Lyo（リョウ）。個人事業「Lyo Vision」代表。
              コードは書けない。でもClaude Codeと24体のAIエージェントで、
              コンテンツ制作の仕組みを構築し、実際に事業を回しています。
            </motion.p>

            <motion.p
              className="text-text-secondary leading-[1.8] mb-8 text-[15px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              このサイトで公開している仕組みは、すべて自分で使っているもの。
              机上の空論ではなく、実際に動いているシステムの設計図を共有しています。
            </motion.p>

            {/* Stats with animated counters */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {stats.map((s, i) => (
                <StatCard key={s.label} stat={s} delay={0.3 + i * 0.1} />
              ))}
            </div>

            {/* Quote */}
            <motion.blockquote
              className="relative pl-6 border-l-2 border-primary/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-white text-lg font-serif italic leading-relaxed">
                &ldquo;出し惜しみしない。失敗も含めてすべて共有する。&rdquo;
              </p>
            </motion.blockquote>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
