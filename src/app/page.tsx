"use client";

import Image from "next/image";
import Header from "@/components/Header";
import CinematicShowcase from "@/components/CinematicShowcase";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import AnimatedCTA from "@/components/AnimatedCTA";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main-content">
        {/* LP(b): インパクト — こんなサイトが980円 */}
        <section className="bg-black">
          <Image
            src="/lp-impact.webp"
            alt="こんなサイトが、980円。"
            width={2752}
            height={1536}
            className="w-full h-auto"
            priority
            sizes="100vw"
          />
        </section>

        {/* LP(a): サービス説明 */}
        <section className="bg-[#0a0a0f]">
          <div className="max-w-[600px] mx-auto">
            <Image
              src="/lp-service.webp"
              alt="しくみや — あなたの個人ギャラリーサイト"
              width={1792}
              height={2400}
              className="w-full h-auto"
              sizes="(max-width: 600px) 100vw, 600px"
            />
          </div>
        </section>

        {/* なぜ¥980 */}
        <section className="bg-[#0a0a0f] px-6 py-12">
          <div className="max-w-[600px] mx-auto text-center">
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-6">
              なぜ¥980で提供できるのか
            </h3>
            <div className="space-y-4 max-w-[480px] mx-auto text-left">
              <div className="flex items-start gap-3">
                <span className="text-primary text-lg mt-0.5">01</span>
                <p className="text-text-secondary text-sm leading-relaxed">
                  プロがデザインしたテンプレートを、あなた専用にカスタマイズ。ゼロから作る必要がありません。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-lg mt-0.5">02</span>
                <p className="text-text-secondary text-sm leading-relaxed">
                  サーバー・ドメイン・保守まで一括管理。個別に契約する手間もコストもゼロ。
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-lg mt-0.5">03</span>
                <p className="text-text-secondary text-sm leading-relaxed">
                  この仕組みがあるから、外注では考えられない価格が実現できます。
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-white/[0.06]">
              <div>
                <p className="text-text-muted text-[10px] tracking-wider mb-1">一般的な外注費用</p>
                <p className="text-text-muted text-xl line-through">5〜10万円</p>
              </div>
              <div className="flex items-center text-text-muted/30 text-2xl">→</div>
              <div>
                <p className="text-primary text-[10px] tracking-wider mb-1">しくみや</p>
                <p className="text-primary text-3xl font-bold">¥980</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#0a0a0f]">
          <AnimatedCTA />
        </div>

        {/* テンプレート一覧 — 映画の幕開け演出 */}
        <CinematicShowcase />

        {/* 料金プラン */}
        <PricingSection />

        {/* よくある質問 */}
        <FAQSection />

        {/* お問い合わせ */}
        <ContactSection />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
