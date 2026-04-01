"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="px-6 py-24 md:py-32"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* CTA Band */}
        <motion.div
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-16 md:py-20"
          style={{ backgroundColor: "var(--color-accent)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative triangles */}
          <svg
            className="pointer-events-none absolute top-0 right-0 opacity-10"
            width="300"
            height="300"
            viewBox="0 0 300 300"
            aria-hidden="true"
          >
            <path d="M150 0 L300 300 L0 300 Z" fill="var(--color-text)" />
          </svg>
          <svg
            className="pointer-events-none absolute bottom-0 left-0 opacity-10"
            width="200"
            height="200"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <path d="M100 0 L200 200 L0 200 Z" fill="var(--color-text)" />
          </svg>

          <h2
            className="relative z-10 text-3xl font-bold md:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            一緒に始めましょう
          </h2>
          <p
            className="relative z-10 mt-4 text-base"
            style={{ color: "var(--color-text)", opacity: 0.7 }}
          >
            プロジェクトのアイデアがありますか？お気軽にご相談ください。
          </p>
          <a
            href="mailto:hello@example.com"
            className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            <Mail size={16} />
            お問い合わせ
            <ArrowUpRight size={14} />
          </a>
        </motion.div>

        {/* Contact info below */}
        <div className="mt-16 grid gap-8 text-center md:grid-cols-3">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-accent-gold)" }}
            >
              メール
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              hello@example.com
            </p>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-accent-gold)" }}
            >
              所在地
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              東京
            </p>
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-accent-gold)" }}
            >
              SNS
            </p>
            <div className="mt-2 flex justify-center gap-4">
              <a
                href="#"
                className="text-sm underline transition-colors hover:text-[var(--color-accent-gold)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                X (Twitter)
              </a>
              <a
                href="#"
                className="text-sm underline transition-colors hover:text-[var(--color-accent-gold)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-sm underline transition-colors hover:text-[var(--color-accent-gold)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Dribbble
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
