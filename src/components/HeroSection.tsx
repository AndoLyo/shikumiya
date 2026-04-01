"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const templatePreviews = [
  { id: "cinematic-dark", name: "Cinematic Dark", colors: ["#0a0a1a", "#00bbdd", "#d42d83"] },
  { id: "minimal-grid", name: "Minimal Grid", colors: ["#f5f3ef", "#A28D69", "#2a2a2a"] },
  { id: "warm-natural", name: "Warm Natural", colors: ["#f2eee7", "#fffe3e", "#333333"] },
  { id: "horizontal-scroll", name: "Horizontal Scroll", colors: ["#0a0a0a", "#e63946", "#EFE8D7"] },
  { id: "elegant-mono", name: "Elegant Mono", colors: ["#1a1a1a", "#00bbdd", "#d42d83"] },
  { id: "ai-art-portfolio", name: "AI Art Portfolio", colors: ["#0a0a0f", "#6366f1", "#f59e0b"] },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const cardsY = useTransform(scrollYProgress, [0, 0.5], ["0%", "15%"]);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,229,255,0.08),transparent)]" />

      <motion.div
        className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20 min-h-screen flex flex-col justify-center"
        style={{ opacity: contentOpacity }}
      >
        {/* Main content - 2 column on desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-text-secondary text-[11px] tracking-[0.15em]">
                ¥980〜 テンプレート10種公開中
              </span>
            </motion.div>

            {/* Main copy */}
            <motion.h1
              className="font-serif text-white font-bold leading-[1.15] tracking-wide"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              あなたのAIアート、
              <br />
              <span className="text-shimmer">流れていくだけでいいの？</span>
            </motion.h1>

            {/* Sub copy */}
            <motion.p
              className="mt-5 sm:mt-6 text-text-secondary text-sm sm:text-base leading-relaxed max-w-[480px] mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              XやPixivに投稿するだけじゃ、作品は流れていく。
              <br className="hidden sm:block" />
              フォーム入力だけで、あなただけのギャラリーサイトが完成します。
            </motion.p>

            {/* Trust indicators */}
            <motion.div
              className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-1 text-text-muted text-[11px] tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span>✓ コード知識不要</span>
              <span>✓ 最短当日完成</span>
              <span>✓ ¥980買い切りから</span>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href="#pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 text-center"
              >
                料金プランを見る
              </a>
              <a
                href="#showcase"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/[0.1] text-text-secondary text-sm tracking-wider hover:text-white hover:border-white/25 transition-all duration-300 text-center"
              >
                テンプレートを見る →
              </a>
            </motion.div>
          </div>

          {/* Right: Template preview cards */}
          <motion.div
            className="flex-1 w-full max-w-[520px]"
            style={{ y: cardsY }}
          >
            <div className="grid grid-cols-2 gap-3">
              {templatePreviews.map((tpl, i) => (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                >
                  <Link
                    href={`/templates/${tpl.id}`}
                    className="group block rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                  >
                    {/* Color preview area */}
                    <div
                      className="h-20 sm:h-28 relative overflow-hidden"
                      style={{ background: tpl.colors[0] }}
                    >
                      {/* Abstract layout mockup */}
                      <div className="absolute inset-3 flex flex-col gap-1.5 opacity-60 group-hover:opacity-80 transition-opacity">
                        <div
                          className="h-1 w-8 rounded-full"
                          style={{ background: tpl.colors[1] }}
                        />
                        <div className="flex-1 flex gap-1.5 mt-1">
                          <div
                            className="flex-1 rounded"
                            style={{ background: `${tpl.colors[1]}20` }}
                          />
                          <div
                            className="w-1/3 rounded"
                            style={{ background: `${tpl.colors[2]}15` }}
                          />
                        </div>
                        <div className="flex gap-1">
                          <div
                            className="h-1 w-6 rounded-full"
                            style={{ background: `${tpl.colors[2]}40` }}
                          />
                          <div
                            className="h-1 w-4 rounded-full"
                            style={{ background: `${tpl.colors[1]}30` }}
                          />
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          デモを見る →
                        </span>
                      </div>
                    </div>
                    {/* Name */}
                    <div className="px-3 py-2 bg-[#0d0d15]">
                      <p className="text-text-secondary text-[10px] tracking-wider group-hover:text-white transition-colors">
                        {tpl.name}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="text-center mt-3 text-text-muted text-[10px] tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              他にも4種類のテンプレートを公開中
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />
    </section>
  );
}
