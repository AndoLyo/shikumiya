"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
};

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
          {/* Left: Character / Key visual */}
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
              {/* Frame decoration */}
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-primary/30" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-primary/30" />
            </div>
          </motion.div>

          {/* Right: Text */}
          <div className="w-full lg:w-[60%]">
            <SectionHeading title="ABOUT" subtitle="プロフィール" />

            <motion.p
              className="text-text-secondary leading-[1.8] mb-6"
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Lyo（リョウ）。個人事業「Lyo Vision」代表。
              2023年からAIアート画像生成のプロンプト研究を始め、
              Midjourney・Stable Diffusion・DALL-E・Fluxなど
              主要ツールすべてのプロンプト設計技法を体系化してきました。
            </motion.p>

            <motion.p
              className="text-text-secondary leading-[1.8] mb-6"
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              3年間の研究で培ったプロンプトエンジニアリングの知見をベースに、
              現在はClaude Codeを活用した自律型AIエージェントシステムの開発に注力。
              24のAIエージェントと12以上のスキルスクリプトを構築し、
              コンテンツ制作ワークフローの自動化を実現しています。
            </motion.p>

            <motion.p
              className="text-text-secondary leading-[1.8] mb-8"
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              noteでは「AIアートプロンプト集」と「開発日記」の2本柱で発信中。
              月曜は開発日記、水曜はAIアート記事、金曜はプロンプト設計と、
              週3本の定期更新で活動しています。
            </motion.p>

            {/* Quote */}
            <motion.blockquote
              className="relative pl-6 border-l-2 border-primary/40 mb-6"
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-white text-lg sm:text-xl font-serif italic leading-relaxed">
                &ldquo;自分にもできそう&rdquo;から、&ldquo;実際にできた&rdquo;へ。
                すべてのクリエイターに、その体験を届けたい。
              </p>
            </motion.blockquote>

            <motion.p
              className="text-text-muted text-sm italic"
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              — AIアートで活動する人を支える。失敗も含めてすべて共有する。
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
