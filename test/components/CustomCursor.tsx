"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const outlinePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only show custom cursor on desktop
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Smooth outline follow using requestAnimationFrame
    let animId: number;
    const animateOutline = () => {
      const dx = posRef.current.x - outlinePosRef.current.x;
      const dy = posRef.current.y - outlinePosRef.current.y;
      outlinePosRef.current.x += dx * 0.15;
      outlinePosRef.current.y += dy * 0.15;
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${outlinePosRef.current.x - 20}px, ${outlinePosRef.current.y - 20}px)`;
      }
      animId = requestAnimationFrame(animateOutline);
    };
    animId = requestAnimationFrame(animateOutline);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden lg:block"
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: isHovering ? 12 : 8,
            height: isHovering ? 12 : 8,
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Outer outline */}
      <div
        ref={outlineRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none hidden lg:block"
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="rounded-full border border-white/40"
          animate={{
            width: isHovering ? 56 : 40,
            height: isHovering ? 56 : 40,
            borderColor: isHovering ? "rgba(0, 229, 255, 0.6)" : "rgba(255, 255, 255, 0.3)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Hide default cursor via global style */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
