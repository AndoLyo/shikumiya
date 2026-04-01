"use client";

import { motion } from "framer-motion";

const socialLinks = [
  { label: "X (Twitter)", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "note", href: "#" },
  { label: "Behance", href: "#" },
];

export function ContactSection() {
  return (
    <section id="contact" className="pb-16">
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
          Contact
        </h2>
        <div className="w-12 h-px bg-[var(--color-accent)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-lg"
      >
        {/* Email */}
        <p className="text-sm text-[var(--color-text-muted)] mb-2">
          お気軽にご連絡ください
        </p>
        <a
          href="mailto:hello@example.com"
          className="text-lg tracking-wider text-[var(--color-accent)] hover:underline underline-offset-4 transition-colors duration-300"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          hello@example.com
        </a>

        {/* Contact Form */}
        <form className="mt-12 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
              お名前
            </label>
            <input
              type="text"
              placeholder="お名前"
              className="w-full bg-transparent border-b border-[var(--color-border)] pb-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full bg-transparent border-b border-[var(--color-border)] pb-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
              メッセージ
            </label>
            <textarea
              rows={4}
              placeholder="メッセージを入力..."
              className="w-full bg-transparent border-b border-[var(--color-border)] pb-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none transition-colors duration-300 resize-none"
            />
          </div>

          <button
            type="submit"
            className="text-xs tracking-widest uppercase border border-[var(--color-accent)] text-[var(--color-accent)] px-8 py-3 hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300"
          >
            送信する
          </button>
        </form>

        {/* Social Links */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
          <p className="text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] mb-4">
            フォロー
          </p>
          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
