"use client";

import { useRef, useState, useEffect } from "react";

interface LazyIframeProps {
  src: string;
  title: string;
  fallbackBg: string;
  fallbackColors: string[];
  className?: string;
  iframeWidth?: number;
  iframeHeight?: number;
  scale?: number;
}

export default function LazyIframe({
  src,
  title,
  fallbackBg,
  fallbackColors,
  className = "h-36 sm:h-44",
  iframeWidth = 1280,
  iframeHeight = 800,
  scale = 0.2,
}: LazyIframeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ background: fallbackBg }}
    >
      {/* Fallback color mockup (shows until iframe loads) */}
      {!loaded && (
        <div className="absolute inset-3 flex flex-col gap-1.5 opacity-50">
          <div className="h-1 w-10 rounded-full" style={{ background: fallbackColors[0] }} />
          <div className="flex-1 flex gap-1.5 mt-1">
            <div className="flex-[2] rounded" style={{ background: `${fallbackColors[0]}18` }} />
            <div className="flex-1 rounded" style={{ background: `${(fallbackColors[1] || fallbackColors[0])}12` }} />
          </div>
          <div className="flex gap-1">
            <div className="h-0.5 w-8 rounded-full" style={{ background: `${(fallbackColors[1] || fallbackColors[0])}30` }} />
            <div className="h-0.5 w-5 rounded-full" style={{ background: `${fallbackColors[0]}20` }} />
          </div>
        </div>
      )}

      {/* iframe (only loads when scrolled into view) */}
      {visible && (
        <iframe
          src={src}
          className={`absolute top-0 left-0 border-none pointer-events-none transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{
            width: `${iframeWidth}px`,
            height: `${iframeHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          tabIndex={-1}
          title={title}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
