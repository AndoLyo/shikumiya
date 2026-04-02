"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, AtSign, Globe, ExternalLink } from "lucide-react";

const STYLE = `
  .fg-contact-glass {
    background: rgba(28, 28, 38, 0.7);
    backdrop-filter: blur(28px) saturate(1.5);
    -webkit-backdrop-filter: blur(28px) saturate(1.5);
  }
  .fg-gradient-border {
    position: relative;
  }
  .fg-gradient-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(108,99,255,0.6), rgba(165,160,255,0.4), rgba(108,99,255,0.2), rgba(108,99,255,0.5));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  @keyframes fg-particle-float {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: var(--max-opacity, 0.4); }
    90% { opacity: var(--max-opacity, 0.4); }
    100% { transform: translateY(-120px) translateX(var(--drift, 20px)); opacity: 0; }
  }
  .fg-particle {
    animation: fg-particle-float var(--dur, 6s) ease-in-out infinite;
    animation-delay: var(--delay, 0s);
  }
  .fg-social-link {
    transition: all 0.3s ease;
  }
  .fg-social-link:hover {
    background: rgba(108,99,255,0.15) !important;
    border-color: var(--fg-accent) !important;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(108,99,255,0.2);
  }
  .fg-email-btn {
    transition: all 0.3s ease;
  }
  .fg-email-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(108,99,255,0.4), 0 0 0 1px rgba(108,99,255,0.3) !important;
  }
`;

/* Floating particle dots */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: ((i * 97.3 + 15) % 90) + 5,
  y: ((i * 61.7 + 30) % 70) + 15,
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  dur: 5 + (i % 4) * 1.5,
  delay: (i % 6) * 0.8,
  drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 3) * 8),
  opacity: 0.2 + (i % 3) * 0.1,
}));

const SOCIAL_LINKS = [
  {
    label: "Twitter / X",
    handle: "@ai_artist_yuki",
    icon: AtSign,
    href: "#",
  },
  {
    label: "Instagram",
    handle: "@ai_art_yuki",
    icon: AtSign,
    href: "#",
  },
  {
    label: "Portfolio Site",
    handle: "yukisora.art",
    icon: Globe,
    href: "#",
  },
];

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const [copied, setCopied] = useState(false);

  function handleEmailCopy() {
    navigator.clipboard.writeText("hello@yukisora.art").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 px-6 sm:px-10 overflow-hidden"
      style={{ background: "var(--fg-bg)", minHeight: "70vh", display: "flex", alignItems: "center" }}
    >
      <style>{STYLE}</style>

      {/* Particle floating dots */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: yParallax }}
      >
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="fg-particle absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size * 2,
              height: p.size * 2,
              background: "var(--fg-accent)",
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
              "--drift": `${p.drift}px`,
              "--max-opacity": p.opacity,
            } as React.CSSProperties}
          />
        ))}
      </motion.div>

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(108,99,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Bottom indigo glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--fg-accent) 30%, var(--fg-accent-light) 50%, var(--fg-accent) 70%, transparent 100%)",
          opacity: 0.4,
          boxShadow: "0 0 20px rgba(108,99,255,0.4), 0 0 60px rgba(108,99,255,0.2)",
        }}
      />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs tracking-[0.5em] uppercase mb-3 font-medium"
            style={{ color: "var(--fg-accent)" }}
          >
            Contact
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight"
            style={{ color: "var(--fg-text)" }}
          >
            お問い合わせ
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ color: "var(--fg-text-muted)" }}
          >
            コラボレーションのご依頼・作品購入・
            <br />
            その他のお問い合わせはこちらから。
          </p>
        </motion.div>

        {/* Contact glass card */}
        <motion.div
          className="fg-contact-glass fg-gradient-border rounded-2xl p-8 sm:p-10"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Email section */}
          <div className="mb-8">
            <p
              className="text-xs tracking-widest uppercase mb-4 font-medium"
              style={{ color: "var(--fg-text-muted)" }}
            >
              メールアドレス
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 flex-1 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(108,99,255,0.08)",
                  border: "1px solid var(--fg-border)",
                }}
              >
                <Mail size={16} style={{ color: "var(--fg-accent)" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--fg-text)" }}
                >
                  hello@yukisora.art
                </span>
              </div>
              <motion.button
                className="fg-email-btn px-4 py-3 rounded-xl text-xs font-semibold tracking-wider"
                style={{
                  background:
                    "linear-gradient(135deg, var(--fg-accent), rgba(108,99,255,0.7))",
                  color: "var(--fg-text)",
                  boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
                  minWidth: 72,
                }}
                onClick={handleEmailCopy}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? "COPIED!" : "COPY"}
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--fg-border), transparent)",
            }}
          />

          {/* Social links */}
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-4 font-medium"
              style={{ color: "var(--fg-text-muted)" }}
            >
              SNS
            </p>
            <div className="space-y-3">
              {SOCIAL_LINKS.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="fg-social-link flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(108,99,255,0.05)",
                      border: "1px solid var(--fg-border)",
                      textDecoration: "none",
                    }}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} style={{ color: "var(--fg-accent)" }} />
                      <div>
                        <div
                          className="text-xs font-semibold"
                          style={{ color: "var(--fg-text)" }}
                        >
                          {link.label}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--fg-text-muted)" }}
                        >
                          {link.handle}
                        </div>
                      </div>
                    </div>
                    <ExternalLink
                      size={12}
                      style={{ color: "var(--fg-text-muted)" }}
                    />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Response time note */}
          <p
            className="mt-8 text-center text-xs"
            style={{ color: "var(--fg-text-muted)" }}
          >
            通常2〜3営業日以内にご返信いたします。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
