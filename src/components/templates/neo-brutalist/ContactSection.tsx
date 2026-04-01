"use client";

import { motion } from "framer-motion";

const socialLinks = [
  { label: "X", href: "#" },
  { label: "INSTAGRAM", href: "#" },
  { label: "DRIBBBLE", href: "#" },
  { label: "GITHUB", href: "#" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  },
};

export function ContactSection() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20">
      <div
        className="w-full max-w-[1400px] mx-auto"
        style={{ borderTop: "4px solid #1a1a1a" }}
      >
        <div className="pt-12">
          {/* Big heading */}
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="font-black uppercase leading-[0.9] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 8rem)",
              color: "#1a1a1a",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            SAY HELLO
          </motion.h2>

          {/* Email */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            className="mt-8 mb-12"
          >
            <a
              href="mailto:hello@example.com"
              className="font-mono text-xl md:text-2xl underline transition-opacity hover:opacity-70"
              style={{
                color: "#1a1a1a",
                textDecorationColor: "#ff5722",
                textDecorationThickness: "4px",
                textUnderlineOffset: "6px",
              }}
            >
              hello@example.com
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            className="flex flex-wrap gap-4 mb-20"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                variants={linkVariants}
                href={link.href}
                className="inline-flex items-center font-mono font-bold uppercase px-6 py-3 text-sm transition-colors duration-200 hover:bg-[#1a1a1a] hover:text-[#fffdf5]"
                style={{
                  border: "3px solid #1a1a1a",
                  color: "#1a1a1a",
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div
          className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
          style={{ borderTop: "1px solid #1a1a1a" }}
        >
          <p className="font-mono text-xs" style={{ color: "#1a1a1a" }}>
            &copy; 2026 YOUR NAME. All rights reserved.
          </p>
          <p className="font-mono text-xs" style={{ color: "#1a1a1a" }}>
            正直に、大胆に。
          </p>
        </div>
      </div>
    </section>
  );
}
