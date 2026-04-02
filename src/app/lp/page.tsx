"use client";

import Image from "next/image";
import AnimatedCTA from "@/components/AnimatedCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function LPServicePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* LP Image */}
      <div className="w-full max-w-[600px] mx-auto">
        <Image
          src="/lp-service.webp"
          alt="しくみや — あなたの個人ギャラリーサイト"
          width={1792}
          height={2400}
          className="w-full h-auto"
          priority
          sizes="(max-width: 600px) 100vw, 600px"
        />
      </div>

      {/* Why ¥980 section */}
      <section className="bg-[#0a0a0f] px-6 py-12 max-w-[600px] mx-auto">
        <h3 className="text-white font-bold text-lg sm:text-xl text-center mb-4">
          なぜ¥980で提供できるのか
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed text-center max-w-[480px] mx-auto">
          しくみやは、プロが設計したテンプレートを活用する方式。
          ゼロから作らないから、外注の1/100の価格で同等クオリティのサイトをお届けできます。
        </p>
        <div className="flex justify-center gap-6 mt-6 text-center">
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
      </section>

      {/* Animated CTA */}
      <div className="bg-[#0a0a0f] pb-24">
        <AnimatedCTA />
      </div>

      {/* Sticky CTA for mobile */}
      <StickyMobileCTA />
    </main>
  );
}
