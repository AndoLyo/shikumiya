"use client";

import Image from "next/image";
import AnimatedCTA from "@/components/AnimatedCTA";

export default function LPImpactPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center">
      {/* LP Image */}
      <div className="w-full">
        <Image
          src="/lp-impact.png"
          alt="こんなサイトが、980円。"
          width={1920}
          height={1080}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Animated CTA */}
      <div className="w-full bg-black">
        <AnimatedCTA />
      </div>
    </main>
  );
}
