"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  @keyframes de-rule-expand {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
  .de-rule-animate {
    transform-origin: left center;
    animation: de-rule-expand 0.8s cubic-bezier(0.16,1,0.3,1) both;
  }
  .de-skill-tag {
    transition: all 0.25s ease;
  }
  .de-skill-tag:hover {
    border-color: var(--de-gold) !important;
    color: var(--de-gold) !important;
    background: rgba(201,169,110,0.08) !important;
  }
  .de-about-glass {
    background: rgba(13,13,13,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
`;

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultSkills = [
  "Midjourney",
  "Stable Diffusion",
  "ComfyUI",
  "Adobe Firefly",
  "Photoshop",
  "Lightroom",
  "ControlNet",
  "LoRA Training",
];

const defaultStats = [
  { value: "180+", label: "作品数" },
  { value: "6年", label: "キャリア" },
  { value: "40+", label: "受賞歴" },
];

export function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  const data = useSiteData();
  const artistName = data?.artistName || "Lyo";
  const subtitleText = data?.subtitle || "AI Artist & Digital Creator";
  const locationText = data?.location || "Tokyo, Japan";
  const bioText = data?.bio || "";
  const mottoText = data?.motto || "";
  const skills = data?.skills && data.skills.length > 0 ? data.skills : (data ? [] : defaultSkills);
  const tools = data?.tools && data.tools.length > 0 ? data.tools : [];
  const displaySkills = skills.length > 0 ? skills : tools;
  const stats = data
    ? (data.stats && data.stats.length > 0
        ? data.stats.slice(0, 3).map((s) => {
            const parts = s.split(":");
            return { value: parts[0] || s, label: parts[1] || "" };
          })
        : [])
    : defaultStats;

  return (
    <>
      <style>{STYLE}</style>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onClose}
            />

            {/* Panel — slides up from bottom */}
            <motion.div
              className="de-about-glass fixed left-0 right-0 bottom-0 z-50 overflow-y-auto"
              style={{
                maxHeight: "80vh",
                borderTop: "1px solid var(--de-border)",
                right: "200px",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative max-w-3xl mx-auto px-10 py-12">
                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    background: "none",
                    border: "1px solid var(--de-border)",
                    color: "var(--de-text-muted)",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "16px",
                    lineHeight: 1,
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--de-gold)";
                    (e.currentTarget as HTMLElement).style.color = "var(--de-gold)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--de-border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--de-text-muted)";
                  }}
                  aria-label="閉じる"
                >
                  ×
                </button>

                {/* Top gold rule */}
                <div
                  className="de-rule-animate"
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, var(--de-gold), transparent)",
                    marginBottom: "32px",
                    width: "80px",
                  }}
                />

                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.4em",
                    color: "var(--de-gold)",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  About the Artist
                </motion.div>

                {/* Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "clamp(28px, 5vw, 44px)",
                    color: "var(--de-text)",
                    fontStyle: "italic",
                    lineHeight: 1.2,
                    marginBottom: "8px",
                  }}
                >
                  {artistName}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.28 }}
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    color: "var(--de-text-muted)",
                    marginBottom: "32px",
                  }}
                >
                  {subtitleText} — {locationText}
                </motion.div>

                {/* Stats row */}
                {stats.length > 0 && <motion.div
                  className="flex gap-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ marginBottom: "32px" }}
                >
                  {stats.map((s, i) => (
                    <div key={s.label}>
                      <div
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontSize: "26px",
                          color: "var(--de-gold)",
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.25em",
                          color: "var(--de-text-muted)",
                          textTransform: "uppercase",
                          marginTop: "4px",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </motion.div>}

                {/* Gold divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, var(--de-gold), transparent)",
                    transformOrigin: "left center",
                    marginBottom: "28px",
                    width: "100%",
                  }}
                />

                {/* Bio */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="whitespace-pre-wrap"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "15px",
                    lineHeight: 1.85,
                    color: "var(--de-text-muted)",
                    marginBottom: "16px",
                  }}
                >
                  {bioText || (!data ? <>光と影の狭間に宿る美を、AIという新しい筆で描き続けています。
                  かつて写真家として培った「一瞬を切り取る感性」を武器に、
                  デジタルとアナログの境界を超えた作品世界を追求しています。</> : "")}
                </motion.p>

                {!data && <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.47 }}
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "15px",
                    lineHeight: 1.85,
                    color: "var(--de-text-muted)",
                    marginBottom: "36px",
                  }}
                >
                  作品は国内外のギャラリー・コレクターへ提供。
                  「見た者の記憶に刻まれる一枚」を信条に、
                  妥協のないクオリティを追い続けています。
                </motion.p>}

                {/* Skills */}
                {displaySkills.length > 0 && <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.52 }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.35em",
                      color: "var(--de-gold)",
                      textTransform: "uppercase",
                      marginBottom: "14px",
                    }}
                  >
                    Tools &amp; Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displaySkills.map((skill, i) => (
                      <span
                        key={skill}
                        className="de-skill-tag"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          color: "var(--de-text-muted)",
                          border: "1px solid var(--de-border)",
                          padding: "5px 12px",
                          cursor: "default",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>}

                {/* Bottom gold rule */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, var(--de-gold), transparent)",
                    transformOrigin: "center",
                    marginTop: "40px",
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
