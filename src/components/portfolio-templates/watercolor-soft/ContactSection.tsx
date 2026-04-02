"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Link2, Image } from "lucide-react";

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "#",
    icon: Link2,
    color: "#7FB5D5",
    bg: "rgba(127,181,213,0.12)",
  },
  {
    label: "Instagram",
    href: "#",
    icon: Image,
    color: "#E8B4C8",
    bg: "rgba(232,180,200,0.12)",
  },
  {
    label: "pixiv",
    href: "#",
    icon: ExternalLink,
    color: "#8FBFA0",
    bg: "rgba(143,191,160,0.12)",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 px-5 sm:px-8"
    >
      {/* Soft gradient background: blue → green → pink, very subtle */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(160deg, rgba(127,181,213,0.12) 0%, rgba(143,191,160,0.10) 45%, rgba(232,180,200,0.12) 100%)",
          backgroundColor: "var(--wc-bg)",
        }}
      />

      {/* Decorative watercolor SVG corners */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top left */}
        <svg className="absolute -top-8 -left-12 w-56 opacity-15" viewBox="0 0 220 200">
          <defs>
            <radialGradient id="cBlob1" cx="40%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#7FB5D5" />
              <stop offset="100%" stopColor="#7FB5D5" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M40,20 C90,-5 170,20 190,75 C210,130 180,200 120,210 C60,220 -10,180 5,110 C15,55 -10,45 40,20Z"
            fill="url(#cBlob1)"
          />
        </svg>
        {/* Bottom right */}
        <svg className="absolute -bottom-10 -right-10 w-64 opacity-15" viewBox="0 0 240 220">
          <defs>
            <radialGradient id="cBlob2" cx="60%" cy="60%" r="55%">
              <stop offset="0%" stopColor="#E8B4C8" />
              <stop offset="100%" stopColor="#E8B4C8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M60,10 C120,-15 210,15 225,80 C240,145 200,220 130,225 C60,230 0,180 10,105 C18,45 0,35 60,10Z"
            fill="url(#cBlob2)"
          />
        </svg>
        {/* Bottom left small */}
        <svg className="absolute bottom-16 left-8 w-24 opacity-12" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="45" ry="40" fill="var(--wc-green)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Mail icon */}
          <div
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full shadow-md"
            style={{
              backgroundColor: "var(--wc-surface)",
              border: "1px solid var(--wc-border)",
            }}
          >
            <Mail className="h-6 w-6" style={{ color: "var(--wc-blue)" }} />
          </div>
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--wc-blue)" }}
          >
            Contact
          </p>
          <h2
            className="text-3xl font-semibold md:text-4xl"
            style={{ color: "var(--wc-text)" }}
          >
            お問い合わせ
          </h2>
          <p className="mt-3 text-sm italic" style={{ color: "var(--wc-text-muted)" }}>
            お仕事のご依頼・コラボのご提案はお気軽にどうぞ
          </p>
        </motion.div>

        {/* Frosted glass card */}
        <motion.div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow:
              "0 8px 40px rgba(127,181,213,0.12), 0 2px 12px rgba(0,0,0,0.04)",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  className="mb-2 block text-xs font-medium tracking-wider"
                  style={{ color: "var(--wc-text-muted)" }}
                >
                  お名前
                </label>
                <input
                  type="text"
                  placeholder="山田 みずき"
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,181,213,0.2)]"
                  style={{
                    borderColor: "var(--wc-border)",
                    backgroundColor: "rgba(248,245,240,0.6)",
                    color: "var(--wc-text)",
                  }}
                />
              </div>
              {/* Email */}
              <div>
                <label
                  className="mb-2 block text-xs font-medium tracking-wider"
                  style={{ color: "var(--wc-text-muted)" }}
                >
                  メールアドレス
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,181,213,0.2)]"
                  style={{
                    borderColor: "var(--wc-border)",
                    backgroundColor: "rgba(248,245,240,0.6)",
                    color: "var(--wc-text)",
                  }}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                className="mb-2 block text-xs font-medium tracking-wider"
                style={{ color: "var(--wc-text-muted)" }}
              >
                件名
              </label>
              <input
                type="text"
                placeholder="水彩画制作のご依頼について"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,181,213,0.2)]"
                style={{
                  borderColor: "var(--wc-border)",
                  backgroundColor: "rgba(248,245,240,0.6)",
                  color: "var(--wc-text)",
                }}
              />
            </div>

            {/* Message */}
            <div>
              <label
                className="mb-2 block text-xs font-medium tracking-wider"
                style={{ color: "var(--wc-text-muted)" }}
              >
                メッセージ
              </label>
              <textarea
                rows={5}
                placeholder="ご依頼内容・ご質問などをご記入ください"
                className="w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(127,181,213,0.2)]"
                style={{
                  borderColor: "var(--wc-border)",
                  backgroundColor: "rgba(248,245,240,0.6)",
                  color: "var(--wc-text)",
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-full py-4 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_6px_24px_rgba(127,181,213,0.5)] hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: "var(--wc-blue)" }}
            >
              送信する
            </button>
          </form>
        </motion.div>

        {/* Social links as soft pill buttons */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p
            className="mb-5 text-sm italic"
            style={{ color: "var(--wc-text-muted)" }}
          >
            SNSでもつながりましょう
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon, color, bg }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  backgroundColor: bg,
                  color,
                  border: `1px solid ${color}33`,
                }}
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
