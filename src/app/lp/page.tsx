"use client";

import Image from "next/image";
import AnimatedCTA from "@/components/AnimatedCTA";

export default function LPServicePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* LP Image */}
      <div className="w-full max-w-[600px] mx-auto">
        <Image
          src="/lp-service.png"
          alt="しくみや — あなたの個人ギャラリーサイト"
          width={1080}
          height={2400}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Animated CTA */}
      <div className="bg-[#0a0a0f]">
        <AnimatedCTA />
      </div>
    </main>
  );
}
