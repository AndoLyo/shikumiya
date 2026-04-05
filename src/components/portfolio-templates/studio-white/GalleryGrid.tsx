"use client";

import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import type { Work } from "@/app/portfolio-templates/studio-white/page";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  .sw-grid-item {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: var(--sw-surface);
  }
  .sw-grid-item::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s ease;
  }
  .sw-grid-item:hover::after {
    background: rgba(0, 0, 0, 0.04);
  }
  .sw-grid-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }
  .sw-grid-item:hover .sw-grid-overlay {
    opacity: 1;
  }
  .sw-zoom-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.85);
    opacity: 0;
    transition: opacity 0.25s ease, transform 0.25s ease;
    z-index: 3;
  }
  .sw-grid-item:hover .sw-zoom-icon {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

interface GalleryGridProps {
  works: Work[];
  onOpen: (index: number) => void;
}

export function GalleryGrid({ works, onOpen }: GalleryGridProps) {
  const siteData = useSiteData();

  return (
    <section
      id="works"
      style={{
        padding: "80px 60px 80px 60px",
      }}
    >
      <style>{STYLE}</style>

      {/* Section header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="text-xs tracking-[0.35em] uppercase mb-2"
          style={{ color: "var(--sw-text-muted)" }}
        >
          Selected Works
        </p>
        <div
          className="w-8 h-px"
          style={{ background: "var(--sw-accent)" }}
        />
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            variants={itemVariants}
            className="sw-grid-item"
            onClick={() => onOpen(index)}
            role="button"
            tabIndex={0}
            aria-label={`${work.title}を全画面で表示`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(index);
              }
            }}
            style={{ border: "1px solid var(--sw-border)" }}
          >
            {/* Image placeholder — uniform square container */}
            <div
              style={{
                aspectRatio: "1 / 1",
                background: work.gradient,
              }}
            />

            {/* Hover overlay */}
            <div className="sw-grid-overlay">
              <p
                className="text-xs tracking-[0.15em] uppercase"
                style={{ color: "var(--sw-text-muted)" }}
              >
                {work.medium}
              </p>
              <p
                className="text-sm font-light mt-0.5"
                style={{ color: "var(--sw-text)" }}
              >
                {work.title}
              </p>
            </div>

            {/* Zoom icon */}
            <div className="sw-zoom-icon">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid var(--sw-border)",
                }}
              >
                <ZoomIn size={16} style={{ color: "var(--sw-accent)" }} strokeWidth={1.5} />
              </div>
            </div>

            {/* Bottom label (always visible) */}
            <div
              className="flex items-center justify-between px-3 py-2.5"
              style={{ borderTop: "1px solid var(--sw-border)" }}
            >
              <span
                className="text-xs tracking-wide"
                style={{ color: "var(--sw-text)" }}
              >
                {work.title}
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: "var(--sw-text-muted)" }}
              >
                {work.year}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
