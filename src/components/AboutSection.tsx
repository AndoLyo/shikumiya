"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

function useCounter(target: number, duration = 2000, startCounting = false) {
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
  { value: 10, suffix: "種", label: "テンプレート公開", color: "text-cyan-400" },
  { value: 3, suffix: "年", label: "AIアート歴", color: "text-violet-400" },
  { value: 980, suffix: "円〜", label: "サイト制作", color: "text-amber-400" },
  { value: 70, suffix: "%", label: "記事の無料公開率", color: "text-emerald-400" },
];

function StatCard({ stat, delay }: { stat: (typeof stats)[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useCounter(stat.value, 1500, isInView);
  return (
    <motion.div
      ref={ref}
      className="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center group hover:border-white/[0.12] transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`font-serif text-2xl font-bold ${stat.color}`}>
        {count}
        {stat.suffix}
      </div>
      <div className="text-text-muted text-[10px] mt-1">{stat.label}</div>
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/portfolio/work_03.webp" alt="" fill className="object-cover opacity-[0.06]" sizes="100vw" />
        <div className="absolute inset-0 bg-[#0a0a0f]/92" />
        <div className="absolute inset-0 mesh-gradient-1" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <motion.div
            className="w-full lg:w-[35%] flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-[3/4] max-h-[440px] mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <Image src="/portfolio/about.webp" alt="Lyo" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 35vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>

          {/* Text */}
          <div className="w-full lg:w-[65%]">
            <SectionHeading title="運営者について" number="— 02" />

            <motion.p
              className="text-text-secondary leading-[1.9] mb-4 text-[15px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Lyo（リョウ）。個人事業「Lyo Vision」代表。
              AIアート歴3年の現役AIアーティスト。自分自身がクリエイターだからこそ、作品が映えるサイトを作れます。テンプレート10種はすべて、アーティスト目線で設計しました。
            </motion.p>

            <motion.p
              className="text-text-secondary leading-[1.9] mb-8 text-[15px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              制作の全過程をnoteで公開中。失敗も含めてすべて見せる。出し惜しみしない姿勢で、あなたのサイト制作を全力でサポートします。
            </motion.p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {stats.map((s, i) => (
                <StatCard key={s.label} stat={s} delay={0.3 + i * 0.08} />
              ))}
            </div>

            {/* Quote */}
            <motion.blockquote
              className="relative pl-5 border-l-2 border-primary/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-white text-base font-serif italic leading-relaxed">
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
