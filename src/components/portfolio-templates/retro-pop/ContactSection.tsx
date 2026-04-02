"use client";

import { motion } from "framer-motion";
import { Mail, ExternalLink, Link2, ImageIcon } from "lucide-react";

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "#",
    icon: Link2,
    bg: "var(--rp-text)",
    color: "#fff",
  },
  {
    label: "Instagram",
    href: "#",
    icon: ImageIcon,
    bg: "var(--rp-pink)",
    color: "#fff",
  },
  {
    label: "pixiv",
    href: "#",
    icon: ExternalLink,
    bg: "var(--rp-teal)",
    color: "#fff",
  },
];

// Wavy SVG bottom edge
function WavyBottom() {
  return (
    <svg
      viewBox="0 0 1440 60"
      className="block w-full"
      preserveAspectRatio="none"
      height="60"
      aria-hidden="true"
      style={{ fill: "var(--rp-text)" }}
    >
      <path d="M0,30 C120,55 240,5 360,30 C480,55 600,5 720,30 C840,55 960,5 1080,30 C1200,55 1320,5 1440,30 L1440,60 L0,60 Z" />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--rp-yellow)" }}
    >
      {/* Color stripe top */}
      <div className="w-full flex border-b-2" style={{ borderColor: "var(--rp-border)" }} aria-hidden="true">
        {["var(--rp-orange)", "var(--rp-teal)", "var(--rp-pink)", "var(--rp-text)", "var(--rp-orange)", "var(--rp-teal)", "var(--rp-pink)", "var(--rp-text)"].map(
          (c, i) => (
            <div key={i} className="h-2 flex-1" style={{ backgroundColor: c }} />
          )
        )}
      </div>

      <div className="py-20 px-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          {/* SAY HELLO big text */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="mb-2 text-xs font-black uppercase tracking-widest"
              style={{ color: "var(--rp-orange)" }}
            >
              ★ CONTACT
            </p>
            <h2
              className="text-5xl font-black uppercase tracking-tighter md:text-7xl"
              style={{
                color: "var(--rp-text)",
                WebkitTextStroke: "2px var(--rp-border)",
              }}
            >
              SAY HELLO!
            </h2>
            <p
              className="mt-4 text-sm font-bold"
              style={{ color: "var(--rp-text-muted)" }}
            >
              お仕事のご依頼・コラボのご提案はいつでもどうぞ！
            </p>

            {/* Envelope icon circle */}
            <div className="mt-6 flex justify-center">
              <div
                className="w-16 h-16 border-2 flex items-center justify-center rotate-6"
                style={{
                  backgroundColor: "var(--rp-orange)",
                  borderColor: "var(--rp-border)",
                }}
              >
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div
            className="border-2 p-8 sm:p-10"
            style={{
              backgroundColor: "var(--rp-surface)",
              borderColor: "var(--rp-border)",
              boxShadow: "6px 6px 0px var(--rp-border)",
            }}
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
                    className="mb-2 block text-xs font-black uppercase tracking-widest"
                    style={{ color: "var(--rp-text-muted)" }}
                  >
                    お名前 <span style={{ color: "var(--rp-orange)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="山田 太郎"
                    className="w-full border-2 px-4 py-3 text-sm font-bold outline-none transition-all duration-200 focus:shadow-[3px_3px_0px_var(--rp-orange)]"
                    style={{
                      borderColor: "var(--rp-border)",
                      backgroundColor: "var(--rp-bg)",
                      color: "var(--rp-text)",
                    }}
                  />
                </div>
                {/* Email */}
                <div>
                  <label
                    className="mb-2 block text-xs font-black uppercase tracking-widest"
                    style={{ color: "var(--rp-text-muted)" }}
                  >
                    メールアドレス <span style={{ color: "var(--rp-orange)" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full border-2 px-4 py-3 text-sm font-bold outline-none transition-all duration-200 focus:shadow-[3px_3px_0px_var(--rp-orange)]"
                    style={{
                      borderColor: "var(--rp-border)",
                      backgroundColor: "var(--rp-bg)",
                      color: "var(--rp-text)",
                    }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-widest"
                  style={{ color: "var(--rp-text-muted)" }}
                >
                  件名
                </label>
                <input
                  type="text"
                  placeholder="イラスト制作のご依頼について"
                  className="w-full border-2 px-4 py-3 text-sm font-bold outline-none transition-all duration-200 focus:shadow-[3px_3px_0px_var(--rp-orange)]"
                  style={{
                    borderColor: "var(--rp-border)",
                    backgroundColor: "var(--rp-bg)",
                    color: "var(--rp-text)",
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="mb-2 block text-xs font-black uppercase tracking-widest"
                  style={{ color: "var(--rp-text-muted)" }}
                >
                  メッセージ <span style={{ color: "var(--rp-orange)" }}>*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="ご依頼内容・ご質問などをご記入ください"
                  className="w-full resize-none border-2 px-4 py-3 text-sm font-bold outline-none transition-all duration-200 focus:shadow-[3px_3px_0px_var(--rp-orange)]"
                  style={{
                    borderColor: "var(--rp-border)",
                    backgroundColor: "var(--rp-bg)",
                    color: "var(--rp-text)",
                  }}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="w-full py-4 text-sm font-black uppercase tracking-widest text-white border-2 transition-all duration-150"
                style={{
                  backgroundColor: "var(--rp-orange)",
                  borderColor: "var(--rp-border)",
                }}
                whileHover={{
                  y: -3,
                  boxShadow: "5px 5px 0px var(--rp-border)",
                }}
                whileTap={{ y: 0, boxShadow: "none" }}
              >
                SEND MESSAGE →
              </motion.button>
            </form>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p
              className="mb-5 text-xs font-black uppercase tracking-widest"
              style={{ color: "var(--rp-text)" }}
            >
              OR FIND ME ON
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {socialLinks.map(({ label, href, icon: Icon, bg, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-black uppercase tracking-wide border-2"
                  style={{
                    backgroundColor: bg,
                    color,
                    borderColor: "var(--rp-border)",
                  }}
                  whileHover={{
                    y: -3,
                    boxShadow: "4px 4px 0px var(--rp-border)",
                  }}
                  whileTap={{ y: 0, boxShadow: "none" }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wavy bottom into footer */}
      <WavyBottom />
    </section>
  );
}
