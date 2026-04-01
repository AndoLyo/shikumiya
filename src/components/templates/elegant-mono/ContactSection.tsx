"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { OrnamentalDivider } from "./OrnamentalDivider";
import { Mail, ExternalLink } from "lucide-react";

const socialLinks = [
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Behance", href: "#" },
];

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-8"
      style={{
        background:
          "radial-gradient(ellipse at center bottom, #222222 0%, var(--color-bg) 70%)",
      }}
    >
      <div className="text-center max-w-xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center">
            <OrnamentalDivider width={100} color="#555555" />
          </div>
          <h2
            className="text-3xl md:text-5xl tracking-[0.2em] font-normal my-4"
            style={{
              color: "var(--color-text)",
              fontStyle: "italic",
            }}
          >
            お問い合わせ
          </h2>
          <div className="flex justify-center">
            <OrnamentalDivider width={100} color="#555555" />
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-base leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          お仕事のご依頼やコラボレーションのご相談、お気軽にご連絡ください。
        </motion.p>

        {/* Email */}
        <motion.a
          href="mailto:hello@example.com"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center gap-3 mt-8 text-lg tracking-[0.1em] transition-colors duration-300 no-underline"
          style={{ color: "var(--color-accent)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-accent-pink)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-accent)")
          }
        >
          <Mail size={18} />
          hello@example.com
        </motion.a>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-8"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase transition-colors duration-300 no-underline"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
            >
              {link.label}
              <ExternalLink
                size={10}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          ))}
        </motion.div>

        {/* Bottom ornamental divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-24"
        >
          <div className="flex justify-center">
            <OrnamentalDivider width={80} color="#333333" />
          </div>
          <p
            className="mt-6 text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "var(--color-border)" }}
          >
            &copy; 2025 Portfolio. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
