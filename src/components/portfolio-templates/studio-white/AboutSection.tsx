"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

export function AboutSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "Your Name";
  const bioText = data?.bio || "";
  const profileImage = data?.profileImage;
  const email = data?.email || "hello@lyo-vision.art";

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
          {artistName}
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
        {(bioText || !data) && (
          <p
            className="text-sm leading-relaxed mb-6 whitespace-pre-wrap"
            style={{ color: "var(--sw-text)", fontWeight: 300, maxWidth: "480px" }}
          >
            {bioText || "AIと人間の感性が交わる場所で、静けさを形にする。\n余白を恐れず、装飾を排し、一枚の作品が語るべきものをただ語らせる。\nそれだけが、私のやることです。"}
          </p>
        )}

        {/* Contact */}
        <div id="contact">
          <a
            href={`mailto:${email}`}
            className="text-xs tracking-[0.2em] uppercase transition-colors duration-200"
            style={{ color: "var(--sw-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--sw-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--sw-text-muted)")
            }
          >
            {email}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
