"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/site.config";

export default function GallerySection() {
  const { gallery } = siteConfig;
  const [selected, setSelected] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll
    ? gallery.works
    : gallery.works.slice(0, gallery.initialDisplay);

  return (
    <section id="gallery" className="section-padding bg-[#0d0d12]">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading
          title={gallery.title}
          subtitle={gallery.subtitle}
          align="center"
        />

        <motion.p
          className="text-center text-text-secondary max-w-[600px] mx-auto mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {gallery.description}
        </motion.p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
          {displayed.map((work, i) => (
            <motion.div
              key={work.src}
              className="relative aspect-square cursor-pointer overflow-hidden group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              onClick={() => setSelected(i)}
            >
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end justify-start p-4">
                <span className="text-white text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {work.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more */}
        {gallery.works.length > gallery.initialDisplay && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 border border-primary/30 text-primary font-mono text-xs tracking-widest uppercase hover:bg-primary/10 transition-all cursor-pointer"
            >
              {showAll ? "Show Less" : `Show All ${gallery.works.length} Works`}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={gallery.works[selected].src}
                alt={gallery.works[selected].title}
                width={1200}
                height={1200}
                className="object-contain max-h-[85vh] w-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-mono text-sm">
                  {gallery.works[selected].title}
                </p>
              </div>
              {/* Nav */}
              {selected > 0 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-primary/30 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(selected - 1);
                  }}
                >
                  &#8249;
                </button>
              )}
              {selected < gallery.works.length - 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-primary/30 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(selected + 1);
                  }}
                >
                  &#8250;
                </button>
              )}
            </motion.div>
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl font-light cursor-pointer"
              onClick={() => setSelected(null)}
            >
              &#10005;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
