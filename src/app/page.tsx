"use client";

import Image from "next/image";
import Header from "@/components/Header";
import ShowcaseSection from "@/components/ShowcaseSection";
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
            <h3 className="text-white font-bold text-lg sm:text-xl mb-4">
              なぜ¥980で提供できるのか
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-[480px] mx-auto">
              しくみやは、プロが設計したテンプレートを活用する方式。
              ゼロから作らないから、外注の1/100の価格で同等クオリティのサイトをお届けできます。
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <div>
                <p className="text-text-muted text-xs">通常の外注</p>
                <p className="text-text-muted text-lg line-through">5〜10万円</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-primary text-xs">しくみや</p>
                <p className="text-primary text-2xl font-bold">¥980</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#0a0a0f]">
          <AnimatedCTA />
        </div>

        {/* テンプレート一覧 */}
        <ShowcaseSection />

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
