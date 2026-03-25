"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";

const solutions = [
  {
    icon: "📝",
    title: "記事制作の自動化",
    description: "構成→執筆→SEO→サムネイル→公開まで、AIエージェントがパイプラインで処理。あなたはテーマを決めるだけ。",
  },
  {
    icon: "📱",
    title: "SNS投稿の自動化",
    description: "Instagram・Threads・Xへの投稿文生成からスケジュール投稿まで。プラットフォームごとの最適化もAIが判断。",
  },
  {
    icon: "🎨",
    title: "サムネイル設計の自動化",
    description: "記事の内容を読み取り、クリック率の高いサムネイルをAIが設計。プロンプト生成まで一気通貫。",
  },
  {
    icon: "🔍",
    title: "SEO・タイトル最適化",
    description: "タイトル案・ハッシュタグ・冒頭文をAIが複数パターン生成。数字に基づいた改善提案も。",
  },
  {
    icon: "🤖",
    title: "24体のAIエージェント",
    description: "制作部・編集部・広報部・経営企画部。役割ごとに専門化したAIが連携して、1人分以上の仕事をこなす。",
  },
  {
    icon: "📖",
    title: "すべてをオープンに公開",
    description: "仕組みの設計図・コード・失敗談まで全部見せる。あなたが同じ仕組みを作るためのドキュメントを提供。",
  },
];

export default function PillarsSection() {
  return (
    <section id="solution" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/portfolio/work_19.webp"
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0a0a0f]/90" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <SectionHeading title="SOLUTION" subtitle="しくみやが解決すること" align="center" />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          AIの力を借りて、コンテンツ制作のあらゆる工程を仕組み化。
          あなたは「何を伝えるか」に集中できます。
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="text-2xl mb-3">{s.icon}</div>
              <h3 className="text-white font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
