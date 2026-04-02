"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Mail, ExternalLink, X } from "lucide-react";

const STYLE = `
  .de-contact-backdrop {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .de-contact-link {
    transition: all 0.3s ease;
    border-bottom: 1px solid transparent;
  }
  .de-contact-link:hover {
    border-bottom-color: var(--de-gold);
    color: var(--de-gold) !important;
  }
  .de-social-link {
    transition: all 0.3s ease;
  }
  .de-social-link:hover {
    color: var(--de-gold) !important;
    border-color: var(--de-gold) !important;
    background: rgba(201,169,110,0.06) !important;
  }
  .de-close-btn {
    transition: all 0.25s ease;
  }
  .de-close-btn:hover {
    border-color: var(--de-gold) !important;
    color: var(--de-gold) !important;
    background: rgba(201,169,110,0.08) !important;
    transform: rotate(90deg);
  }
`;

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const socialLinks = [
  { label: "X / Twitter", href: "https://x.com/", platform: "@ando_lyo" },
  { label: "Instagram", href: "https://instagram.com/", platform: "@lyo.art" },
  { label: "note", href: "https://note.com/", platform: "Lyo Vision" },
  { label: "Behance", href: "https://behance.net/", platform: "Lyo Works" },
];

export function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      <style>{STYLE}</style>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="de-contact-backdrop fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(13,13,13,0.92)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={onClose}
          >
            {/* Content card — stops propagation */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "560px",
                margin: "0 24px",
                padding: "56px 48px",
                background: "var(--de-surface)",
                border: "1px solid var(--de-border)",
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="de-close-btn"
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "none",
                  border: "1px solid var(--de-border)",
                  color: "var(--de-text-muted)",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "0",
                }}
                aria-label="閉じる"
              >
                <X size={14} />
              </button>

              {/* Gold top accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "48px",
                  right: "48px",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, var(--de-gold), transparent)",
                }}
              />

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.45em",
                  color: "var(--de-gold)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Get in Touch
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "32px",
                  fontStyle: "italic",
                  color: "var(--de-text)",
                  lineHeight: 1.2,
                  marginBottom: "8px",
                }}
              >
                Contact
              </motion.h2>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                style={{
                  fontSize: "12px",
                  color: "var(--de-text-muted)",
                  marginBottom: "36px",
                  lineHeight: 1.7,
                }}
              >
                作品の購入・使用許諾・コラボレーションのご相談は<br />
                お気軽にご連絡ください。
              </motion.p>

              {/* Gold rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                  height: "1px",
                  background: "linear-gradient(90deg, var(--de-gold), transparent)",
                  transformOrigin: "left center",
                  marginBottom: "32px",
                }}
              />

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45 }}
                style={{ marginBottom: "32px" }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.35em",
                    color: "var(--de-text-muted)",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  Email
                </div>
                <a
                  href="mailto:hello@lyo-vision.art"
                  className="de-contact-link group flex items-center gap-3"
                  style={{
                    color: "var(--de-text)",
                    textDecoration: "none",
                    fontSize: "15px",
                    letterSpacing: "0.05em",
                    display: "inline-flex",
                    paddingBottom: "4px",
                  }}
                >
                  <Mail size={15} style={{ color: "var(--de-gold)", flexShrink: 0 }} />
                  hello@lyo-vision.art
                </a>
              </motion.div>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.45 }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.35em",
                    color: "var(--de-text-muted)",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}
                >
                  Social
                </div>
                <div className="flex flex-col gap-2">
                  {socialLinks.map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="de-social-link flex items-center justify-between"
                      style={{
                        color: "var(--de-text-muted)",
                        textDecoration: "none",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        border: "1px solid var(--de-border)",
                        padding: "10px 14px",
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.48 + i * 0.06, duration: 0.35 }}
                    >
                      <span>{link.label}</span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--de-text-muted)",
                          opacity: 0.6,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {link.platform}
                        <ExternalLink size={9} />
                      </span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Gold bottom accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "48px",
                  right: "48px",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, var(--de-gold), transparent)",
                  opacity: 0.4,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
