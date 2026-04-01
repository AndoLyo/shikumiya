"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="pb-24">
      {/* Gold ornament line */}
      <div className="flex items-center gap-4 mb-16">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <div className="w-2 h-2 rotate-45 bg-[var(--color-accent)]" />
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* Section Header */}
      <div className="mb-12">
        <h2
          className="text-3xl tracking-wider mb-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          About
        </h2>
        <div className="w-12 h-px bg-[var(--color-accent)]" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col md:flex-row gap-12 items-start"
      >
        {/* Profile Image Placeholder */}
        <div className="shrink-0">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 border-2 border-[var(--color-border)]" />
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h3
              className="text-xl tracking-wider mb-1"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Your Name
            </h3>
            <p className="text-[11px] tracking-widest uppercase text-[var(--color-text-muted)]">
              デザイナー / デベロッパー / クリエイター
            </p>
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-text)] max-w-lg">
            ミニマルで丁寧なデザインを軸に、一つひとつのプロジェクトの背景にあるストーリーを大切にしています。見た目の美しさだけでなく、伝わるビジュアルを追求しています。
          </p>

          <p className="text-sm leading-relaxed text-[var(--color-text)] max-w-lg">
            デザインからコーディングまで一貫して手がけることで、細部までこだわった作品をお届けします。
          </p>

          {/* Skills */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
              スキル
            </p>
            <p className="text-sm text-[var(--color-text)]">
              <span className="text-[var(--color-accent)]">UI/UX Design</span>,{" "}
              <span className="text-[var(--color-accent)]">Branding</span>,{" "}
              <span className="text-[var(--color-accent)]">Web Development</span>,{" "}
              <span className="text-[var(--color-accent)]">Photography</span>,{" "}
              <span className="text-[var(--color-accent)]">Typography</span>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
