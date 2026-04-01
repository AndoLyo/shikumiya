"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/site.config";

export default function AboutSection() {
  const { about } = siteConfig;

  return (
    <section id="about" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            className="w-full lg:w-[40%] flex-shrink-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[3/4] max-h-[500px] mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <Image
                src={about.image}
                alt={siteConfig.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>

          {/* Text */}
          <div className="w-full lg:w-[60%]">
            <SectionHeading title={about.title} subtitle={about.subtitle} />

            {about.paragraphs.map((text, i) => (
              <motion.p
                key={i}
                className="text-text-secondary leading-[1.8] mb-6 text-[15px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              >
                {text}
              </motion.p>
            ))}

            {/* Tools */}
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {about.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-full border border-primary/20 text-primary font-mono text-[11px] tracking-wider"
                >
                  {tool}
                </span>
              ))}
            </motion.div>

            {/* Quote */}
            {about.quote && (
              <motion.blockquote
                className="relative pl-6 border-l-2 border-primary/40"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-white text-lg font-serif italic leading-relaxed">
                  &ldquo;{about.quote}&rdquo;
                </p>
              </motion.blockquote>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
