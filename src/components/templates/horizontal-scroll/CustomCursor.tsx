"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const outerX = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });
  const outerY = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    // Detect touch device
    const hasTouch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
    if (hasTouch) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      outerX.set(e.clientX);
      outerY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnterInteractive = () => setIsHovering(true);
    const handleMouseLeaveInteractive = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, [data-cursor-hover]");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnterInteractive);
        el.addEventListener("mouseleave", handleMouseLeaveInteractive);
      });
      return interactiveElements;
    };

    const elements = addHoverListeners();

    const observer = new MutationObserver(() => {
      addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterInteractive);
        el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
      });
      observer.disconnect();
    };
  }, [outerX, outerY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border"
        style={{
          x: outerX,
          y: outerY,
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          marginLeft: isHovering ? -30 : -20,
          marginTop: isHovering ? -30 : -20,
          borderColor: isHovering ? "var(--color-accent)" : "rgba(239, 232, 215, 0.5)",
          borderWidth: 1,
        }}
        transition={{ width: { duration: 0.2 }, height: { duration: 0.2 } }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        style={{
          x: mousePos.x - 4,
          y: mousePos.y - 4,
          width: 8,
          height: 8,
          backgroundColor: isHovering ? "var(--color-accent)" : "var(--color-text)",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
