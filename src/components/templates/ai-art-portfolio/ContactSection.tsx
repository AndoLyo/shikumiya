"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/site.config";

export default function ContactSection() {
  const { contact } = siteConfig;

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      <div className="relative z-10 max-w-[700px] mx-auto px-6">
        <SectionHeading
          title={contact.title}
          subtitle={contact.subtitle}
          align="center"
        />

        <motion.p
          className="text-center text-text-secondary max-w-[500px] mx-auto mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {contact.description}
        </motion.p>

        {/* Email */}
        {contact.email && (
          <motion.a
            href={`mailto:${contact.email}`}
            className="glow-border block mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <div className="relative rounded-2xl bg-[#0d0d15]/80 backdrop-blur-sm p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-white/[0.06] flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-serif text-white font-semibold mb-1">
                  {siteConfig.lang === "ja" ? "メールで問い合わせ" : "Get in Touch"}
                </h4>
                <p className="text-text-muted text-sm font-mono group-hover:text-primary transition-colors">
                  {contact.email}
                </p>
              </div>
            </div>
          </motion.a>
        )}

        {/* Social links */}
        <motion.div
          className="flex items-center justify-center gap-6 text-text-muted text-sm font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {contact.social.map((s, i) => (
            <span key={s.label} className="flex items-center gap-6">
              {i > 0 && (
                <span className="w-1 h-1 rounded-full bg-primary/30" />
              )}
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300"
              >
                {s.label}
              </a>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
