"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const problems = [
  {
    icon: "⏰",
    title: "毎日のSNS投稿、手動でやってませんか？",
    description:
      "投稿文を考えて、画像を用意して、各プラットフォームに手作業で投稿。リプライ対応まで含めると、SNS運用だけで1日が終わる。",
  },
  {
    icon: "🔁",
    title: "記事を書くたびに、同じ作業の繰り返し",
    description:
      "構成を考えて、本文を書いて、サムネを作って、SEOを調整して、SNSで告知。毎回ゼロからやり直していませんか？",
  },
  {
    icon: "🤯",
    title: "AIツール、多すぎて何から始めればいいか分からない",
    description:
      "ChatGPT、Claude、Midjourney、Stable Diffusion…。ツールは増え続けるけど、実際にどう組み合わせれば事業に使えるのか見えない。",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="section-padding bg-[#0d0d12]">
      <div className="max-w-[1000px] mx-auto px-6">
        <SectionHeading title="PROBLEM" subtitle="こんな悩み、ありませんか？" align="center" />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              className="glass-card p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="text-white font-bold text-base mb-3 leading-relaxed">
                {p.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
