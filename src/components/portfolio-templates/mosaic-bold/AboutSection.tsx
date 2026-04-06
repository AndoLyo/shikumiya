"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const STYLE = `
  .mb-about {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 80vh;
    background: var(--mb-surface);
    border-top: 1px solid var(--mb-border);
  }
  @media (max-width: 768px) {
    .mb-about {
      grid-template-columns: 1fr;
    }
  }
  .mb-about-left {
    background: var(--mb-accent);
    padding: clamp(3rem, 8vw, 6rem) clamp(2rem, 5vw, 4rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .mb-about-left-bg-text {
    position: absolute;
    bottom: -0.15em;
    left: -0.05em;
    font-family: 'Arial Black', 'Arial', sans-serif;
    font-weight: 900;
    font-size: clamp(8rem, 22vw, 18rem);
    letter-spacing: -0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.1);
    line-height: 0.8;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }
  .mb-about-heading {
    font-family: 'Arial Black', 'Arial', sans-serif;
    font-weight: 900;
    font-size: clamp(3rem, 8vw, 6.5rem);
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: #FFFFFF;
    line-height: 0.9;
    position: relative;
    z-index: 1;
  }
  .mb-about-subhead {
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    position: relative;
    z-index: 1;
    margin-top: 1.5rem;
  }
  .mb-profile-img-wrap {
    width: clamp(120px, 25%, 180px);
    aspect-ratio: 1;
    overflow: hidden;
    border: 3px solid #FFFFFF;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    margin-top: 2.5rem;
  }
  .mb-profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.4s ease;
    display: block;
    background: rgba(0,0,0,0.3);
  }
  .mb-profile-img-wrap:hover .mb-profile-img {
    filter: grayscale(0%);
  }
  .mb-about-right {
    background: var(--mb-surface);
    padding: clamp(3rem, 8vw, 6rem) clamp(2rem, 5vw, 4rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2.5rem;
    border-left: 1px solid var(--mb-border);
  }
  @media (max-width: 768px) {
    .mb-about-right {
      border-left: none;
      border-top: 1px solid var(--mb-border);
    }
  }
  .mb-bio-text {
    font-size: 0.95rem;
    line-height: 1.9;
    color: var(--mb-text-muted);
    font-family: 'Courier New', monospace;
    letter-spacing: 0.02em;
  }
  .mb-skill-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--mb-bg);
  }
  .mb-skill-bullet {
    width: 10px;
    height: 10px;
    background: var(--mb-accent);
    flex-shrink: 0;
  }
  .mb-skill-name {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--mb-text);
    font-weight: 700;
    flex: 1;
  }
  .mb-skill-level {
    font-family: 'Courier New', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--mb-text-muted);
  }
`;

const skills = [
  { name: "Midjourney", level: "Expert" },
  { name: "Stable Diffusion", level: "Expert" },
  { name: "ComfyUI", level: "Advanced" },
  { name: "Adobe Firefly", level: "Intermediate" },
  { name: "Post Processing", level: "Expert" },
  { name: "Prompt Engineering", level: "Expert" },
];

export function AboutSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "BOLD";
  const bioText = data?.bio || "";
  const profileImage = data?.profileImage;

  return (
    <section id="about">
      <style>{STYLE}</style>

      <div className="mb-about">
        {/* Left — accent colored panel */}
        <motion.div
          className="mb-about-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Background ghost text */}
          <div className="mb-about-left-bg-text" aria-hidden>ABOUT</div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="mb-about-heading">
              ABOUT<br />THE<br />ARTIST
            </h2>
            <p className="mb-about-subhead">{data?.subtitle || (!data ? "AIアートクリエイター / フォトグラファー" : "")}</p>
          </motion.div>

          {/* Profile image */}
          <motion.div
            className="mb-profile-img-wrap"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Gradient placeholder for profile image */}
            <div
              className="mb-profile-img"
              style={{
                background:
                  "linear-gradient(135deg, #424242 0%, #9E9E9E 40%, #BDBDBD 70%, #757575 100%)",
              }}
              role="img"
              aria-label="プロフィール画像"
            />
          </motion.div>
        </motion.div>

        {/* Right — bio and skills */}
        <motion.div
          className="mb-about-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Section label */}
          <div>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--mb-accent)",
                fontWeight: 700,
              }}
            >
              Profile
            </span>
            <h3
              style={{
                fontFamily: "'Arial Black', 'Arial', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "var(--mb-text)",
                marginTop: "0.4rem",
                lineHeight: 1,
              }}
            >
              VISUAL<br />CREATOR
            </h3>
          </div>

          <p className="mb-bio-text whitespace-pre-wrap">
            {bioText || (!data ? "AIと人間の創造性の交点に立つアーティスト。\n2020年よりAI画像生成の可能性を探求し、\nモノクロームの緊張感と鮮烈な一色を組み合わせた\n高コントラストのビジュアルワークを制作。\n東京を拠点に、国内外のブランド・出版物・展示に作品を提供。" : "")}
          </p>

          {/* Skills list */}
          {(data
            ? (data.skills && data.skills.length > 0 ? data.skills.map(s => ({ name: s, level: "" })) : [])
            : skills
          ).length > 0 && (
            <div>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--mb-text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                Tools &amp; Skills
              </p>
              {(data
                ? (data.skills && data.skills.length > 0 ? data.skills.map(s => ({ name: s, level: "" })) : [])
                : skills
              ).map((skill, i) => (
                <motion.div
                  key={skill.name}
                  className="mb-skill-item"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 + 0.3 }}
                >
                  <div className="mb-skill-bullet" />
                  <span className="mb-skill-name">{skill.name}</span>
                  <span className="mb-skill-level">{skill.level}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
