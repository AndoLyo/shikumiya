"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3, User, Mail } from "lucide-react";

const STYLE = `
  .sw-sidenav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 60px;
    background: var(--sw-surface);
    border-right: 1px solid var(--sw-border);
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sw-sidenav:hover, .sw-sidenav.expanded {
    width: 240px;
  }
  .sw-nav-label {
    opacity: 0;
    white-space: nowrap;
    transition: opacity 0.18s ease;
    pointer-events: none;
  }
  .sw-sidenav:hover .sw-nav-label,
  .sw-sidenav.expanded .sw-nav-label {
    opacity: 1;
    pointer-events: auto;
  }
  .sw-sidenav:hover .sw-logo-text,
  .sw-sidenav.expanded .sw-logo-text {
    opacity: 1;
  }
  .sw-logo-text {
    opacity: 0;
    white-space: nowrap;
    transition: opacity 0.18s ease 0.04s;
  }
`;

const navItems = [
  { icon: Grid3x3, label: "Works", href: "#works" },
  { icon: User, label: "About", href: "#about" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

function scrollToSection(id: string) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function SideNav() {
  const [activeHref, setActiveHref] = useState("#works");

  useEffect(() => {
    const sectionIds = ["#works", "#about", "#contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.4 }
    );

    sectionIds.forEach((id) => {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{STYLE}</style>
      <nav className="sw-sidenav" aria-label="サイドナビゲーション">
        {/* Logo mark */}
        <div
          className="flex items-center w-full px-4 pt-8 pb-10 gap-3"
          style={{ minHeight: "88px" }}
        >
          {/* Geometric mark — always visible */}
          <div
            className="shrink-0 w-7 h-7 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect
                x="1"
                y="1"
                width="26"
                height="26"
                stroke="var(--sw-accent)"
                strokeWidth="1.5"
              />
              <rect
                x="7"
                y="7"
                width="14"
                height="14"
                fill="var(--sw-accent)"
              />
            </svg>
          </div>
          {/* Studio name — visible on expand */}
          <span
            className="sw-logo-text text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--sw-text)", fontWeight: 600 }}
          >
            Studio White
          </span>
        </div>

        {/* Nav items */}
        <ul className="flex flex-col gap-1 w-full px-2 flex-1">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = activeHref === href;
            return (
              <li key={href}>
                <button
                  onClick={() => {
                    setActiveHref(href);
                    scrollToSection(href);
                  }}
                  className="relative flex items-center gap-4 w-full px-3 py-3 rounded-sm transition-colors duration-200"
                  style={{
                    background: isActive
                      ? "var(--sw-bg)"
                      : "transparent",
                    color: isActive
                      ? "var(--sw-accent)"
                      : "var(--sw-text-muted)",
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sw-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: "var(--sw-accent)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2 : 1.5}
                    className="shrink-0 ml-0.5"
                  />
                  <span
                    className="sw-nav-label text-xs tracking-[0.12em] uppercase"
                    style={{ fontWeight: isActive ? 600 : 400 }}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom mark */}
        <div className="pb-8 px-4 w-full flex items-center gap-3">
          <span
            className="shrink-0 text-[10px] font-mono"
            style={{ color: "var(--sw-border)", writingMode: "vertical-rl", letterSpacing: "0.1em" }}
          >
            ©2025
          </span>
          <AnimatePresence>
            <motion.span
              className="sw-nav-label text-[10px] tracking-widest uppercase"
              style={{ color: "var(--sw-border)" }}
            >
              Lyo Vision
            </motion.span>
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
