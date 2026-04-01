"use client";

import { motion } from "framer-motion";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Figma",
  "AI Art",
  "Three.js",
  "Python",
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export function AboutSection() {
  return (
    <section id="about" className="relative z-10 px-6 py-32">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[900px] rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 backdrop-blur-2xl md:p-14"
      >
        <div className="grid items-center gap-10 md:grid-cols-[1fr,2fr]">
          {/* Portrait placeholder */}
          <div className="aspect-square rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />

          {/* Content */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-violet-400">
              ABOUT
            </p>
            <h2 className="mt-3 font-serif text-3xl text-white">Your Name</h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/50">
              <p>
                デザインとコードの両方を扱うクリエイター。テクノロジーとアートの融合で、新しい体験を生み出しています。
              </p>
              <p>
                エンジニアリングとビジュアルデザインの両方のバックグラウンドを活かし、動きのあるインターフェースを設計しています。
              </p>
            </div>

            {/* Skills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-white/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
