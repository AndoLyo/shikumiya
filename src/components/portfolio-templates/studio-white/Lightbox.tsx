"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Work } from "@/app/portfolio-templates/studio-white/page";

const STYLE = `
  .sw-lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(250, 250, 250, 0.96);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sw-lightbox-image {
    max-width: 72vw;
    max-height: 80vh;
    object-fit: contain;
  }
  @media (max-width: 768px) {
    .sw-lightbox-image {
      max-width: 90vw;
    }
  }
`;

interface LightboxProps {
  works: Work[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ works, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  const isOpen = activeIndex !== null;
  const work = activeIndex !== null ? works[activeIndex] : null;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* Lock body scroll while open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <style>{STYLE}</style>
      <AnimatePresence>
        {isOpen && work && (
          <motion.div
            className="sw-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`${work.title} — 全画面表示`}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{
                background: "var(--sw-surface)",
                border: "1px solid var(--sw-border)",
                color: "var(--sw-text-muted)",
              }}
              aria-label="閉じる"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Prev button */}
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: "var(--sw-surface)",
                border: "1px solid var(--sw-border)",
                color: "var(--sw-text)",
              }}
              aria-label="前の作品"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: "var(--sw-surface)",
                border: "1px solid var(--sw-border)",
                color: "var(--sw-text)",
              }}
              aria-label="次の作品"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>

            {/* Main content — stops propagation so clicking image doesn't close */}
            <motion.div
              key={work.id}
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image — object-contain to show full artwork at any ratio */}
              <div
                className="sw-lightbox-image"
                style={{
                  aspectRatio: work.ratio,
                  background: work.gradient,
                  border: "1px solid var(--sw-border)",
                  /* Enforce max dimensions */
                  maxWidth: "72vw",
                  maxHeight: "72vh",
                  width: "100%",
                }}
              />

              {/* Caption panel */}
              <div className="flex flex-col items-center gap-1 text-center">
                <h2
                  className="text-xl font-light tracking-wide"
                  style={{ color: "var(--sw-text)" }}
                >
                  {work.title}
                </h2>
                <p
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "var(--sw-text-muted)" }}
                >
                  {work.medium} &nbsp;—&nbsp; {work.year}
                </p>
                {/* Counter */}
                <p
                  className="text-xs font-mono mt-1"
                  style={{ color: "var(--sw-border)" }}
                >
                  {activeIndex !== null
                    ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`
                    : ""}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
