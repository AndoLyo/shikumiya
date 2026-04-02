"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

// Brush stroke divider SVG
function BrushDivider() {
  return (
    <svg
      className="w-full my-12"
      height="12"
      viewBox="0 0 900 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Main ink brush stroke */}
      <path
        d="M0 6 C60 3, 150 9, 280 6 C410 3, 520 9, 650 6 C780 3, 860 8, 900 6"
        stroke="var(--color-border)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Thin secondary stroke offset */}
      <path
        d="M100 8 C200 6, 320 10, 450 8 C580 6, 700 9.5, 800 8"
        stroke="var(--color-border)"
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Accent ink drop */}
      <circle cx="450" cy="6" r="3" fill="var(--color-accent)" opacity="0.5" />
    </svg>
  );
}

// Vermillion circular seal stamp (logo)
function SealStamp() {
  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer circle */}
      <circle cx="35" cy="35" r="32" stroke="var(--color-accent)" strokeWidth="2" fill="rgba(199,62,58,0.06)" />
      {/* Inner circle */}
      <circle cx="35" cy="35" r="26" stroke="var(--color-accent)" strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* Japanese text — 墨 (sumi) */}
      <text
        x="35"
        y="42"
        textAnchor="middle"
        fontSize="22"
        fontFamily="'Hiragino Mincho ProN', 'Yu Mincho', serif"
        fill="var(--color-accent)"
        fontWeight="700"
      >
        墨
      </text>
    </svg>
  );
}

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "#",
    handle: "@sumi_works",
    glyph: "𝕏",
  },
  {
    label: "Instagram",
    href: "#",
    handle: "@sumi.works",
    glyph: "IG",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 md:py-36 px-8 sm:px-12"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Brush divider */}
        <BrushDivider />

        {/* Seal stamp + heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-8">
            <SealStamp />
          </div>

          <p
            className="text-xs tracking-[0.35em] uppercase mb-4"
            style={{ color: "var(--color-accent)" }}
          >
            Contact
          </p>
          <h2
            className="text-2xl sm:text-3xl font-semibold tracking-[0.06em] mb-6"
            style={{ color: "var(--color-text)" }}
          >
            お問い合わせ
          </h2>
          <p
            className="text-sm leading-loose max-w-md mx-auto"
            style={{ color: "var(--color-text-muted)" }}
          >
            作品の購入・展覧会のご依頼・取材など、
            <br />
            どうぞお気軽にご連絡ください。
          </p>
        </motion.div>

        {/* Email CTA */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a
            href="mailto:hello@sumi-works.jp"
            className="group inline-flex items-center gap-3 text-sm tracking-[0.15em] px-10 py-4 border transition-all duration-400 hover:opacity-75"
            style={{
              borderColor: "var(--color-text)",
              color: "var(--color-text)",
            }}
          >
            <Mail size={16} strokeWidth={1.5} />
            <span>hello@sumi-works.jp</span>
          </a>
        </motion.div>

        {/* Thin divider */}
        <motion.div
          className="flex items-center gap-6 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
          <span
            className="text-xs tracking-[0.25em] flex-shrink-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            SNS
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex justify-center gap-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-60"
              aria-label={social.label}
            >
              <div
                className="w-11 h-11 border flex items-center justify-center transition-colors"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
              >
                <span className="text-sm font-semibold">{social.glyph}</span>
              </div>
              <span
                className="text-xs tracking-[0.15em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {social.handle}
              </span>
            </a>
          ))}
        </motion.div>

        {/* Bottom brush stroke */}
        <motion.div
          className="mt-20"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{ transformOrigin: "center" }}
        >
          <svg
            width="100%"
            height="6"
            viewBox="0 0 600 6"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M5 3 C80 1, 200 5, 300 3 C400 1, 500 5, 595 3"
              stroke="var(--color-border)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
