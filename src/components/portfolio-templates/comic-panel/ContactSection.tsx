"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, AtSign, Camera, Globe, BookOpen, Link2 } from "lucide-react";
import { useSiteData } from "./SiteDataContext";
import type { SiteData } from "@/lib/site-data";

const defaultSocialLinks = [
  { icon: AtSign, label: "Twitter / X", handle: "@yuki_comics", color: "var(--cp-blue)" },
  { icon: Camera, label: "Instagram", handle: "@yuki.manga", color: "var(--cp-red)" },
  { icon: Globe, label: "Portfolio", handle: "yuki-comics.jp", color: "var(--cp-yellow)" },
];

function buildSocialLinks(data: SiteData) {
  const links: { icon: typeof AtSign; label: string; handle: string; color: string; href: string }[] = [];
  if (data.snsX) links.push({ icon: AtSign, label: "X (Twitter)", handle: data.snsX, color: "var(--cp-blue)", href: data.snsX.startsWith("http") ? data.snsX : `https://x.com/${data.snsX.replace("@", "")}` });
  if (data.snsInstagram) links.push({ icon: Camera, label: "Instagram", handle: data.snsInstagram, color: "var(--cp-red)", href: data.snsInstagram.startsWith("http") ? data.snsInstagram : `https://instagram.com/${data.snsInstagram.replace("@", "")}` });
  if (data.snsPixiv) links.push({ icon: BookOpen, label: "Pixiv", handle: data.snsPixiv, color: "var(--cp-blue)", href: data.snsPixiv.startsWith("http") ? data.snsPixiv : `https://pixiv.net/users/${data.snsPixiv}` });
  if (data.snsNote) links.push({ icon: Globe, label: "note", handle: data.snsNote, color: "var(--cp-yellow)", href: data.snsNote.startsWith("http") ? data.snsNote : `https://note.com/${data.snsNote}` });
  if (data.snsOther) links.push({ icon: Link2, label: "Other", handle: data.snsOther, color: "var(--cp-yellow)", href: data.snsOther.startsWith("http") ? data.snsOther : `#` });
  return links;
}

// Horizontal speed lines SVG
function SpeedLinesH({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 5 + i * 5.5;
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="600"
            y2={y}
            stroke="var(--cp-border)"
            strokeWidth={i % 3 === 0 ? "2" : "0.8"}
            strokeOpacity={i % 3 === 0 ? "0.25" : "0.1"}
          />
        );
      })}
    </svg>
  );
}

export default function ContactSection() {
  const data = useSiteData();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const socialLinks = data ? buildSocialLinks(data) : defaultSocialLinks.map((l) => ({ ...l, href: "#" }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 px-5 sm:px-8"
      style={{ backgroundColor: "var(--cp-bg)" }}
    >
      {/* Halftone fade at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(26,26,26,0.1) 1px, transparent 1px)`,
          backgroundSize: "14px 14px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header with speed lines */}
        <motion.div
          className="mb-12 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="px-4 py-2"
              style={{
                backgroundColor: "var(--cp-yellow)",
                border: "3px solid var(--cp-border)",
                boxShadow: "4px 4px 0 var(--cp-border)",
              }}
            >
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--cp-text)" }}>
                Chapter 03
              </span>
            </div>
            <div
              className="flex-1 h-[3px]"
              style={{ backgroundColor: "var(--cp-border)" }}
            />
          </div>

          {/* Large CONTACT! title */}
          <div className="relative text-center py-6 overflow-hidden">
            {/* Speed lines behind */}
            <SpeedLinesH className="absolute inset-0 w-full h-full" />
            <h2
              className="relative text-5xl font-black uppercase italic md:text-7xl"
              style={{
                color: "var(--cp-bg)",
                WebkitTextStroke: "3px var(--cp-border)",
                textShadow: "5px 5px 0 var(--cp-border)",
                letterSpacing: "-0.03em",
              }}
            >
              CONTACT!
            </h2>
            <p
              className="mt-3 text-sm font-black uppercase tracking-widest"
              style={{ color: "var(--cp-text-muted)" }}
            >
              お仕事・コラボ・ファンメール、何でもどうぞ！
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Contact form — speech bubble card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center py-20 px-8 text-center"
                style={{
                  border: "3px solid var(--cp-border)",
                  backgroundColor: "var(--cp-surface)",
                  boxShadow: "7px 7px 0 var(--cp-border)",
                }}
              >
                <span className="text-6xl mb-4">✅</span>
                <p
                  className="text-xl font-black"
                  style={{ color: "var(--cp-text)" }}
                >
                  送信完了！
                </p>
                <p className="mt-2 text-sm font-bold" style={{ color: "var(--cp-text-muted)" }}>
                  2〜3営業日以内にご返信します。
                </p>
                <div
                  className="mt-4 px-3 py-1 text-xs font-black"
                  style={{
                    backgroundColor: "var(--cp-yellow)",
                    border: "2px solid var(--cp-border)",
                    color: "var(--cp-text)",
                  }}
                >
                  TO BE CONTINUED...
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6"
                style={{
                  border: "3px solid var(--cp-border)",
                  backgroundColor: "var(--cp-surface)",
                  boxShadow: "7px 7px 0 var(--cp-border)",
                }}
              >
                {/* Form label header */}
                <div
                  className="mb-5 px-3 py-1.5 inline-block text-xs font-black uppercase tracking-widest text-white"
                  style={{
                    backgroundColor: "var(--cp-border)",
                    borderRadius: "2px",
                  }}
                >
                  ✉ MESSAGE FORM
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label
                    className="block mb-1.5 text-xs font-black uppercase tracking-wider"
                    style={{ color: "var(--cp-text)" }}
                    htmlFor="cp-name"
                  >
                    お名前 *
                  </label>
                  <input
                    id="cp-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="田中 太郎"
                    className="w-full px-4 py-3 text-sm font-bold outline-none transition-all duration-150 focus:translate-x-[-1px] focus:translate-y-[-1px]"
                    style={{
                      border: "2.5px solid var(--cp-border)",
                      borderRadius: "0px",
                      backgroundColor: "#f8f8f0",
                      color: "var(--cp-text)",
                      boxShadow: "inset 2px 2px 0 rgba(26,26,26,0.06)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = "3px 3px 0 var(--cp-border)";
                      e.currentTarget.style.backgroundColor = "var(--cp-surface)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "inset 2px 2px 0 rgba(26,26,26,0.06)";
                      e.currentTarget.style.backgroundColor = "#f8f8f0";
                    }}
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label
                    className="block mb-1.5 text-xs font-black uppercase tracking-wider"
                    style={{ color: "var(--cp-text)" }}
                    htmlFor="cp-email"
                  >
                    メールアドレス *
                  </label>
                  <input
                    id="cp-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="taro@example.com"
                    className="w-full px-4 py-3 text-sm font-bold outline-none transition-all duration-150"
                    style={{
                      border: "2.5px solid var(--cp-border)",
                      borderRadius: "0px",
                      backgroundColor: "#f8f8f0",
                      color: "var(--cp-text)",
                      boxShadow: "inset 2px 2px 0 rgba(26,26,26,0.06)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = "3px 3px 0 var(--cp-border)";
                      e.currentTarget.style.backgroundColor = "var(--cp-surface)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "inset 2px 2px 0 rgba(26,26,26,0.06)";
                      e.currentTarget.style.backgroundColor = "#f8f8f0";
                    }}
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label
                    className="block mb-1.5 text-xs font-black uppercase tracking-wider"
                    style={{ color: "var(--cp-text)" }}
                    htmlFor="cp-message"
                  >
                    メッセージ *
                  </label>
                  <textarea
                    id="cp-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="お仕事の内容、コラボのご提案、ファンメールなど、お気軽にどうぞ！"
                    className="w-full px-4 py-3 text-sm font-bold outline-none resize-none transition-all duration-150"
                    style={{
                      border: "2.5px solid var(--cp-border)",
                      borderRadius: "0px",
                      backgroundColor: "#f8f8f0",
                      color: "var(--cp-text)",
                      boxShadow: "inset 2px 2px 0 rgba(26,26,26,0.06)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = "3px 3px 0 var(--cp-border)";
                      e.currentTarget.style.backgroundColor = "var(--cp-surface)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "inset 2px 2px 0 rgba(26,26,26,0.06)";
                      e.currentTarget.style.backgroundColor = "#f8f8f0";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-black uppercase tracking-wider text-white transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0"
                  style={{
                    backgroundColor: "var(--cp-red)",
                    border: "3px solid var(--cp-border)",
                    boxShadow: "5px 5px 0 var(--cp-border)",
                  }}
                >
                  <Send size={16} />
                  SEND MESSAGE！
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: Social links + info */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Response time panel */}
            <div
              className="p-5"
              style={{
                border: "3px solid var(--cp-border)",
                backgroundColor: "var(--cp-surface)",
                boxShadow: "5px 5px 0 var(--cp-border)",
              }}
            >
              <div
                className="mb-3 inline-block px-3 py-1 text-xs font-black uppercase tracking-wider text-white"
                style={{ backgroundColor: "var(--cp-blue)", borderRadius: "2px" }}
              >
                ℹ INFO
              </div>
              <div className="space-y-3">
                {[
                  { icon: "⚡", label: "返信速度", value: "通常2〜3営業日" },
                  { icon: "💼", label: "お仕事", value: "キャラデザ・漫画制作・監修" },
                  { icon: "🤝", label: "コラボ", value: "歓迎！まずはDMで" },
                  { icon: "📍", label: "対応地域", value: "全国・海外OK（英語可）" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-2"
                    style={{
                      borderLeft: "3px solid var(--cp-yellow)",
                      backgroundColor: "#f8f8f0",
                    }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p
                        className="text-[10px] font-black uppercase tracking-wider"
                        style={{ color: "var(--cp-text-muted)" }}
                      >
                        {item.label}
                      </p>
                      <p className="text-sm font-bold" style={{ color: "var(--cp-text)" }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links — circular panels */}
            {socialLinks.length > 0 && <div>
              <div
                className="mb-3 inline-block px-3 py-1 text-xs font-black uppercase tracking-wider"
                style={{
                  backgroundColor: "var(--cp-yellow)",
                  border: "2px solid var(--cp-border)",
                  color: "var(--cp-text)",
                }}
              >
                SNS LINKS
              </div>
              <div className="flex flex-col gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-4 px-4 py-3 transition-all duration-150"
                      style={{
                        border: "3px solid var(--cp-border)",
                        backgroundColor: "var(--cp-surface)",
                        boxShadow: "4px 4px 0 var(--cp-border)",
                      }}
                      whileHover={{
                        x: -3,
                        y: -3,
                        boxShadow: "7px 7px 0 var(--cp-border)",
                      }}
                    >
                      {/* Icon in circular panel */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: link.color,
                          border: "2.5px solid var(--cp-border)",
                          boxShadow: "2px 2px 0 var(--cp-border)",
                        }}
                      >
                        <Icon size={18} color="#ffffff" />
                      </div>
                      <div>
                        <p
                          className="text-[10px] font-black uppercase tracking-wider"
                          style={{ color: "var(--cp-text-muted)" }}
                        >
                          {link.label}
                        </p>
                        <p className="text-sm font-black" style={{ color: "var(--cp-text)" }}>
                          {link.handle}
                        </p>
                      </div>
                      <span
                        className="ml-auto text-sm font-black"
                        style={{ color: "var(--cp-text-muted)" }}
                      >
                        →
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
