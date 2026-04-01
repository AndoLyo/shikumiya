"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "サイトはどのくらいで完成しますか？",
    a: "テンプレートプラン（¥980）はフォーム入力後、最短で当日〜翌日に完成します。おまかせプラン（¥2,980/月）のカスタマイズは随時対応します。",
  },
  {
    q: "コードの知識は必要ですか？",
    a: "一切不要です。フォームに名前・画像・SNSリンクなどを入力するだけでサイトが完成します。",
  },
  {
    q: "テンプレートプラン（¥980）とおまかせプラン（¥2,980/月）の違いは？",
    a: "テンプレートプランは買い切りで、テンプレートから選んでサイトを作成します。おまかせプランは月額制で、独自ドメイン・カスタマイズ無制限・会員専用コンテンツが付きます。",
  },
  {
    q: "解約したらサイトは消えますか？",
    a: "いいえ。解約後もサイトは公開されたまま残ります。カスタマイズや会員コンテンツの利用が停止されるだけです。再開はいつでも可能です。",
  },
  {
    q: "¥980プランから¥2,980プランにアップグレードできますか？",
    a: "はい。¥980プラン購入から1ヶ月以内にアップグレードすると、初月¥980引き（実質¥2,000）で始められます。",
  },
  {
    q: "どんな作品でも掲載できますか？",
    a: "AIアート・イラスト・写真・デザインなど、画像作品であれば掲載できます。テンプレートは作品が映えるように設計されています。",
  },
  {
    q: "独自ドメインは使えますか？",
    a: "おまかせプラン（¥2,980/月）で対応しています。ドメインの取得費用（年間約1,400円）は別途ご負担いただきます。",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <div className="absolute inset-0 mesh-gradient-1" />

      <div className="relative z-10 max-w-[700px] mx-auto px-6">
        <SectionHeading title="よくある質問" number="— 06" align="center" />

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
