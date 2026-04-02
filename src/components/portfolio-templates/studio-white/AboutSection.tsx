"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "80px 60px",
        borderTop: "1px solid var(--sw-border)",
      }}
    >
      <motion.div
        className="max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Section label */}
        <p
          className="text-xs tracking-[0.35em] uppercase mb-8"
          style={{ color: "var(--sw-text-muted)" }}
        >
          About
        </p>

        {/* Large name */}
        <h2
          className="text-4xl sm:text-5xl font-light tracking-tight mb-8"
          style={{ color: "var(--sw-text)", lineHeight: 1.1 }}
        >
          Lyo
        </h2>

        {/* Divider */}
        <div
          className="mb-8"
          style={{
            width: "40px",
            height: "1px",
            background: "var(--sw-accent)",
          }}
        />

        {/* Bio */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--sw-text)", fontWeight: 300, maxWidth: "480px" }}
        >
          AIと人間の感性が交わる場所で、静けさを形にする。
          余白を恐れず、装飾を排し、一枚の作品が語るべきものをただ語らせる。
          それだけが、私のやることです。
        </p>

        {/* Contact */}
        <div id="contact">
          <a
            href="mailto:hello@lyo-vision.art"
            className="text-xs tracking-[0.2em] uppercase transition-colors duration-200"
            style={{ color: "var(--sw-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--sw-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--sw-text-muted)")
            }
          >
            hello@lyo-vision.art
          </a>
        </div>
      </motion.div>
    </section>
  );
}
