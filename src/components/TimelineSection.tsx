"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const events = [
  { date: "2023", title: "AIアート研究開始", desc: "Midjourneyでの画像生成を皮切りに、プロンプトエンジニアリングの研究を開始", important: false },
  { date: "2024", title: "Stable Diffusion本格稼働", desc: "ローカル環境でのSD運用開始。Hires.fix設定の検証に300時間以上を費やす", important: false },
  { date: "2024.06", title: "note発信スタート", desc: "AIアートプロンプト集の連載を開始。初月から読者の反応を獲得", important: true },
  { date: "2025.06", title: "Lyo Vision 開業", desc: "個人事業主として「Lyo Vision」を設立。AIアート×自動化の2本柱を確立", important: true },
  { date: "2025.09", title: "Lab Member開始", desc: "月額500円のメンバーシッププラン開始。週3-5本のプロンプト配信、Q&Aサポート", important: false },
  { date: "2026.01", title: "自律型AIエージェント開発", desc: "Claude Codeを活用し、18のAIエージェントと12+スキルの開発に成功", important: true },
  { date: "2026.03", title: "開発日記シリーズ開始", desc: "エージェント開発の過程をすべて公開する「開発日記」連載をスタート", important: false },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="section-padding">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading title="TIMELINE" subtitle="これまでとこれから" align="center" />

        {/* Timeline */}
        <div className="relative max-w-[700px] mx-auto">
          {/* Center line */}
          <div className="absolute left-[20px] sm:left-1/2 top-0 bottom-0 w-px bg-border" />

          {events.map((event, i) => {
            const isRight = i % 2 === 1;
            return (
              <motion.div
                key={event.date}
                className={`relative flex items-start gap-6 mb-10 ${
                  // On mobile: always left-aligned. On desktop: alternate
                  "sm:w-1/2 " + (isRight ? "sm:ml-auto sm:pl-10" : "sm:pr-10 sm:text-right")
                } pl-12 sm:pl-0`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                {/* Dot on the line */}
                <div
                  className={`absolute left-[16px] sm:left-auto ${
                    isRight ? "sm:-left-[5px]" : "sm:-right-[5px]"
                  } top-1 w-[10px] h-[10px] rounded-full border-2 bg-primary/30 border-primary`}
                />

                <div>
                  <p className="font-mono text-primary text-xs tracking-widest mb-1">
                    {event.date}
                  </p>
                  <h4 className="text-white font-medium text-sm sm:text-base mb-1">
                    {event.title}
                  </h4>
                  <p className="text-text-muted text-xs leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
