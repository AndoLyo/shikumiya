"use client";

import { motion } from "framer-motion";

const socials = [
  { label: "GitHub", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Dribbble", href: "#" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export function ContactSection() {
  return (
    <section id="contact" className="relative z-10 px-6 py-32 text-center">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-[600px] rounded-3xl border border-white/[0.08] bg-white/[0.03] p-12 backdrop-blur-2xl"
      >
        {/* Heading */}
        <h2 className="font-serif text-3xl text-white">お問い合わせ</h2>

        {/* Gradient line */}
        <div className="my-6 flex justify-center">
          <div className="h-px w-[60px] bg-gradient-to-r from-violet-500 to-pink-500" />
        </div>

        {/* Email */}
        <p className="font-mono text-sm text-violet-300">
          hello@yourname.com
        </p>

        {/* Social links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 font-mono text-xs text-white/60 transition-colors hover:border-violet-500/20 hover:bg-violet-500/10 hover:text-violet-300"
            >
              {social.label}
            </a>
          ))}
        </div>
      </motion.div>

      {/* Copyright */}
      <p className="mt-12 text-[10px] text-white/20">
        &copy; 2025 Your Name. All rights reserved.
      </p>
    </section>
  );
}
