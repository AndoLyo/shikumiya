"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const stats = [
  { value: "24体", label: "AIエージェント稼働中" },
  { value: "¥50万", label: "note売上（半年）" },
  { value: "70%", label: "利益率" },
  { value: "500+", label: "有料記事の購入回数" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/portfolio/work_03.webp"
          alt=""
          fill
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/85" />
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
            <div className="relative aspect-[3/4] max-h-[500px] mx-auto lg:mx-0">
              <Image
                src="/portfolio/about.webp"
                alt="Lyo key visual"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-primary/30" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-primary/30" />
            </div>
          </motion.div>

          {/* Right: Text */}
          <div className="w-full lg:w-[60%]">
            <SectionHeading title="ABOUT" subtitle="なぜ、この情報を信頼できるのか" />

            <motion.p
              className="text-text-secondary leading-[1.8] mb-6"
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
              className="text-text-secondary leading-[1.8] mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              このサイトで公開している仕組みは、すべて自分で使っているもの。
              机上の空論ではなく、実際に動いているシステムの設計図を共有しています。
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {stats.map((s) => (
                <div key={s.label} className="glass-card p-4 text-center">
                  <div className="text-primary font-serif text-xl font-bold">{s.value}</div>
                  <div className="text-text-muted text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              className="relative pl-6 border-l-2 border-primary/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-white text-lg font-serif italic leading-relaxed">
                &ldquo;出し惜しみしない。失敗も含めてすべて共有する。&rdquo;
              </p>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
