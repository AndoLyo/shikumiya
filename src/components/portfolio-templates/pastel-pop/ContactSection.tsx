"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Link2, Image } from "lucide-react";

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "#",
    icon: Link2,
    color: "#7EC8E3",
    bg: "#F0FAFE",
  },
  {
    label: "Instagram",
    href: "#",
    icon: Image,
    color: "#FF7EB3",
    bg: "#FFF0F5",
  },
  {
    label: "pixiv",
    href: "#",
    icon: ExternalLink,
    color: "#C9A0E0",
    bg: "#F3EFF8",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 px-5 sm:px-8"
      style={{
        background:
          "linear-gradient(135deg, #FFE0EF 0%, #FFF0F5 40%, #E8F5FF 100%)",
      }}
    >
      {/* Decorative bubbles */}
      <div
        className="pointer-events-none absolute top-8 right-12 h-32 w-32 rounded-full opacity-30"
        style={{ backgroundColor: "#FFE066" }}
      />
      <div
        className="pointer-events-none absolute bottom-8 left-8 h-20 w-20 rounded-full opacity-25"
        style={{ backgroundColor: "#A8E6CF" }}
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Envelope icon */}
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            <Mail className="h-8 w-8 text-white" />
          </div>
          <p
            className="mb-2 text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-accent)" }}
          >
            Contact
          </p>
          <h2
            className="text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            お問い合わせ
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
            お仕事のご依頼・コラボのご提案はお気軽にどうぞ 💌
          </p>
        </motion.div>

        {/* Contact form card */}
        <motion.div
          className="rounded-3xl p-8 shadow-[0_8px_40px_rgba(255,126,179,0.15)]"
          style={{ backgroundColor: "var(--color-surface)" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  お名前 <span style={{ color: "var(--color-accent)" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="山田 花子"
                  className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_4px_rgba(255,126,179,0.12)]"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
              {/* Email */}
              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  メールアドレス <span style={{ color: "var(--color-accent)" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_4px_rgba(255,126,179,0.12)]"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
              >
                件名
              </label>
              <input
                type="text"
                placeholder="イラスト制作のご依頼について"
                className="w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_4px_rgba(255,126,179,0.12)]"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Message */}
            <div>
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}
              >
                メッセージ <span style={{ color: "var(--color-accent)" }}>*</span>
              </label>
              <textarea
                rows={5}
                placeholder="ご依頼内容・ご質問などをご記入ください"
                className="w-full resize-none rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_4px_rgba(255,126,179,0.12)]"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-full py-4 text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,126,179,0.45)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(255,126,179,0.6)] hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              送信する 💌
            </button>
          </form>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p
            className="mb-5 text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            SNSでもつながりましょう
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon, color, bg }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: bg, color }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
