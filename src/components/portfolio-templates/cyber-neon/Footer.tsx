"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--cn-bg)",
        borderTop: "1px solid var(--cn-border)",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <motion.p
        className="font-mono text-[11px] tracking-[0.25em] uppercase"
        style={{ color: "var(--cn-text-muted)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        &copy; 2026 [Artist Name]. All rights reserved.
      </motion.p>

      <motion.p
        className="font-mono text-[9px] tracking-[0.3em] uppercase"
        style={{
          color: "var(--cn-cyan)",
          textShadow: "0 0 6px var(--cn-cyan)",
          opacity: 0.4,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Powered by Neon
      </motion.p>
    </footer>
  );
}
