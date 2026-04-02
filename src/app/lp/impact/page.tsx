"use client";

import Image from "next/image";
import AnimatedCTA from "@/components/AnimatedCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function LPImpactPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* LP Image */}
      <div className="w-full">
        <Image
          src="/lp-impact.webp"
          alt="こんなサイトが、980円。"
          width={2752}
          height={1536}
          className="w-full h-auto"
          priority
          sizes="100vw"
        />
      </div>

      {/* Animated CTA */}
      <div className="bg-black pb-24">
        <AnimatedCTA />
      </div>

      {/* Sticky CTA for mobile */}
      <StickyMobileCTA />
    </main>
  );
}
