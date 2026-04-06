"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const skills = [
  { label: "水彩画", color: "#7FB5D5", bg: "#EDF5FB" },
  { label: "デジタル水彩", color: "#8FBFA0", bg: "#EDF5F0" },
  { label: "ペン&インク", color: "#3D3D3D", bg: "#F2F0ED" },
  { label: "Procreate", color: "#E8B4C8", bg: "#FBF2F5" },
  { label: "Photoshop", color: "#7FB5D5", bg: "#EDF5FB" },
  { label: "混合技法", color: "#F0C9A6", bg: "#FBF5ED" },
  { label: "ボタニカルアート", color: "#8FBFA0", bg: "#EDF5F0" },
  { label: "ポートレート", color: "#E8B4C8", bg: "#FBF2F5" },
];

const timelineItems = [
  { year: "2019", text: "アナログ水彩画を独学でスタート" },
  { year: "2021", text: "デジタル水彩に移行、オンライン発信を開始" },
  { year: "2022", text: "個展初開催、100点以上の作品を展示" },
  { year: "2024", text: "クライアントワーク50件超、海外からのご依頼も" },
];

export default function AboutSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "Mizuki";
  const bioText = data?.bio || "";
  const profileImage = data?.profileImage;

  return (
    <section
      id="about"
      className="relative overflow-hidden py-24 px-5 sm:px-8"
      style={{ backgroundColor: "var(--wc-bg)" }}
    >
      {/* Background organic blobs — subtle decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg className="absolute -top-24 -right-16 w-72 opacity-10" viewBox="0 0 300 300">
          <path
            d="M60,30 C110,0 220,20 260,80 C300,140 280,240 220,270 C160,300 60,280 30,210 C0,140 10,60 60,30Z"
            fill="var(--wc-pink)"
          />
        </svg>
        <svg className="absolute -bottom-20 -left-20 w-80 opacity-8" viewBox="0 0 300 300">
          <path
            d="M80,20 C140,-10 240,10 270,80 C300,150 260,260 190,280 C120,300 20,260 10,180 C0,100 20,50 80,20Z"
            fill="var(--wc-blue)"
          />
        </svg>
        <svg className="absolute top-1/3 left-1/3 w-48 opacity-6" viewBox="0 0 200 200">
          <ellipse cx="100" cy="100" rx="90" ry="80" fill="var(--wc-green)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--wc-blue)" }}
          >
            About
          </p>
          <h2
            className="text-3xl font-semibold md:text-4xl"
            style={{ color: "var(--wc-text)" }}
          >
            わたしについて
          </h2>
        </motion.div>

        {/* Content row: photo + text */}
        <div className="flex flex-col items-center gap-14 md:flex-row md:items-start md:gap-16">
          {/* Profile photo with decorative watercolor blobs */}
          <motion.div
            className="relative mx-auto shrink-0 md:mx-0"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Decorative blob behind photo */}
            <div className="absolute -inset-6 -z-10" aria-hidden="true">
              <svg viewBox="0 0 240 240" className="w-full h-full opacity-25">
                <defs>
                  <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7FB5D5" />
                    <stop offset="50%" stopColor="#E8B4C8" />
                    <stop offset="100%" stopColor="#8FBFA0" stopOpacity="0.4" />
                  </radialGradient>
                </defs>
                <path
                  d="M50,40 C90,10 170,20 200,70 C230,120 210,200 160,220 C110,240 30,210 15,155 C0,100 10,70 50,40Z"
                  fill="url(#blobGrad)"
                />
              </svg>
            </div>
            {/* Second smaller blob */}
            <div className="absolute -top-4 -right-8 w-28 h-28 -z-10 opacity-20" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M20,10 C50,-5 85,15 90,45 C95,75 70,95 40,90 C10,85 -5,60 5,35 C12,15 20,10 20,10Z"
                  fill="var(--wc-peach)"
                />
              </svg>
            </div>

            {/* Profile circle */}
            <div className="relative h-56 w-56">
              <div
                className="h-full w-full overflow-hidden rounded-full"
                style={{
                  background:
                    "linear-gradient(145deg, #C5D9E8 0%, #B8D9C0 40%, #E8C5D4 100%)",
                  border: "3px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 8px 32px rgba(127,181,213,0.25)",
                }}
              >
                <div className="flex h-full w-full items-center justify-center text-6xl">
                  🎨
                </div>
              </div>
              {/* Small accent dot */}
              <div
                className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-md"
                style={{ backgroundColor: "var(--wc-surface)", border: "2px solid var(--wc-border)" }}
              >
                🌸
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <h3
              className="mb-1 text-2xl font-semibold"
              style={{ color: "var(--wc-text)" }}
            >
              {data ? artistName : "Mizuki（みずき）"}
            </h3>
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--wc-text-muted)" }}
            >
              {data?.subtitle || (!data ? "水彩画家 / デジタルアーティスト" : "")}
            </p>

            {/* Quote with large decorative quotation mark */}
            {(data?.motto || !data) && (
              <blockquote className="relative mb-7 pl-5">
                <span
                  className="absolute -top-6 -left-2 text-7xl font-serif leading-none pointer-events-none select-none"
                  style={{ color: "var(--wc-pink)", opacity: 0.3 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p
                  className="relative text-base italic leading-relaxed"
                  style={{
                    color: "var(--wc-text)",
                    borderLeft: "2px solid var(--wc-border)",
                    paddingLeft: "1rem",
                  }}
                >
                  {data?.motto || (<>水と絵の具が紙の上で出会う瞬間が大好きです。<br />
                  その予測できない広がりの中に、美しさを見つけています。</>)}
                </p>
              </blockquote>
            )}

            {(bioText || !data) && (
              <p
                className="mb-7 text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--wc-text-muted)" }}
              >
                {bioText || "2019年に水彩画を始めて以来、自然・植物・情景を中心に描き続けています。\nアナログの温かみとデジタルの表現力を組み合わせた独自スタイルで、\n国内外のクライアントから依頼をいただいています。\n作品を通じて、日常の中にある静かな美しさを届けたいと思っています。"}
              </p>
            )}

            {/* Skills as soft-colored rounded tags */}
            {(() => {
              const displaySkills = data
                ? (data.skills && data.skills.length > 0
                    ? data.skills.map((s, i) => ({ label: s, color: skills[i % skills.length]?.color || "#7FB5D5", bg: skills[i % skills.length]?.bg || "#EDF5FB" }))
                    : [])
                : skills;
              return displaySkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displaySkills.map((skill) => (
                    <span
                      key={skill.label}
                      className="rounded-full px-4 py-1.5 text-xs font-medium"
                      style={{
                        backgroundColor: skill.bg,
                        color: skill.color,
                        border: `1px solid ${skill.color}33`,
                      }}
                    >
                      {skill.label}
                    </span>
                  ))}
                </div>
              ) : null;
            })()}
          </motion.div>
        </div>

        {/* Timeline — demo only */}
        {!data && <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h4
            className="mb-10 text-center text-base font-medium tracking-wide"
            style={{ color: "var(--wc-text-muted)" }}
          >
            — 活動の歩み —
          </h4>
          <div className="relative mx-auto max-w-2xl">
            {/* Center line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ backgroundColor: "var(--wc-border)" }}
            />
            {timelineItems.map((item, index) => (
              <div
                key={item.year}
                className={`relative mb-8 flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } gap-4`}
              >
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                  }`}
                >
                  <div
                    className="inline-block rounded-2xl px-4 py-3"
                    style={{
                      backgroundColor: "var(--wc-surface)",
                      border: "1px solid var(--wc-border)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--wc-blue)" }}
                    >
                      {item.year}
                    </p>
                    <p
                      className="mt-0.5 text-sm"
                      style={{ color: "var(--wc-text)" }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
                {/* Center dot */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full z-10"
                  style={{
                    backgroundColor: "var(--wc-surface)",
                    border: "2px solid var(--wc-blue)",
                    boxShadow: "0 0 0 4px rgba(127,181,213,0.15)",
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--wc-blue)" }}
                  />
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </motion.div>}
      </div>
    </section>
  );
}
