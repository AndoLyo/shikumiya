"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "ホームページはどのくらいで完成しますか？",
    a: "写真をお送りいただいてから最短翌日で完成します。制作費は0円です。",
  },
  {
    q: "パソコンが苦手ですが大丈夫ですか？",
    a: "はい。写真を送るだけで、あとは全部おまかせです。更新や変更もこちらで対応します。",
  },
  {
    q: "ライト・ミドル・プレミアムの違いは？",
    a: "ライト（¥3,000/月）は基本的なホームページ。ミドル（¥8,000/月）は施工実績やお客様の声、SEO対策が付きます。プレミアム（¥15,000〜/月）はAIチャットや予約システムなどフル機能が使えます。",
  },
  {
    q: "解約したらサイトは消えますか？",
    a: "解約月末までサイトは公開されます。再開はいつでも可能で、データは一定期間保管されます。",
  },
  {
    q: "途中でプランを変えられますか？",
    a: "はい。ライトからミドル、ミドルからプレミアムへいつでもアップグレードできます。ダウングレードも可能です。",
  },
  {
    q: "独自ドメインは使えますか？",
    a: "はい、全プランで対応しています。既にお持ちのドメインも、新しく取得するドメインもお使いいただけます。",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-1" />

      <div className="relative z-10 max-w-[700px] mx-auto px-6">
        <SectionHeading title="よくある質問" number="— 07" align="center" />

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                className="glow-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm overflow-hidden">
                  <button
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="text-sm font-medium text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.5}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
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
