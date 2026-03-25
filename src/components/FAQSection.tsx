"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "コードが書けなくても使えますか？",
    a: "はい。しくみやで公開している仕組みは、Claude Codeを使ってコードを書かずに構築したものです。プログラミング経験がなくても、記事の手順に沿って進めれば再現できるように設計しています。",
  },
  {
    q: "AIエージェントとは何ですか？",
    a: "特定の作業に特化したAIのことです。記事を書くAI、SNSに投稿するAI、サムネイルを設計するAIなど、それぞれの役割を持ったエージェントが連携して作業を自動化します。",
  },
  {
    q: "メンバーシップは何が含まれますか？",
    a: "有料記事の先行アクセス、自動化スクリプト、プロンプトテンプレート、Q&Aサポートが含まれます。上位プランではエージェント設計レビューや1on1フィードバックも利用できます。",
  },
  {
    q: "いつでも解約できますか？",
    a: "はい。noteのメンバーシップはいつでも解約可能です。解約後も当月末まで特典を利用できます。",
  },
  {
    q: "どのSNSに対応していますか？",
    a: "現在開発中のSNS AutoControl Appは、Instagram・Threads・X（Twitter）の3プラットフォームに対応予定です。",
  },
  {
    q: "無料で読めるコンテンツはありますか？",
    a: "はい。noteの記事の約70%は無料で公開しています。開発日記マガジンから始めるのがおすすめです。",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-1" />

      <div className="relative z-10 max-w-[800px] mx-auto px-6">
        <SectionHeading title="FAQ" subtitle="よくある質問" align="center" />

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const triggerId = `faq-trigger-${i}`;

            return (
              <motion.div
                key={i}
                className="glow-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <div className="rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm overflow-hidden">
                  <button
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="text-sm font-medium text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
