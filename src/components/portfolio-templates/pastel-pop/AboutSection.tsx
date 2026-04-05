"use client";

import { motion } from "framer-motion";
import { useSiteData } from "@/lib/SiteDataContext";

const skills = [
  { label: "デジタルイラスト", color: "#FF7EB3", bg: "#FFF0F5" },
  { label: "AIアート", color: "#C9A0E0", bg: "#F3EFF8" },
  { label: "キャラクターデザイン", color: "#7EC8E3", bg: "#F0FAFE" },
  { label: "Stable Diffusion", color: "#A8E6CF", bg: "#F0FBF6" },
  { label: "Midjourney", color: "#FFB347", bg: "#FFFBEE" },
  { label: "Procreate", color: "#FF7EB3", bg: "#FFF0F5" },
  { label: "コミック制作", color: "#C9A0E0", bg: "#F3EFF8" },
  { label: "SNS運用", color: "#7EC8E3", bg: "#F0FAFE" },
];

const timelineItems = [
  { year: "2021", text: "デジタルイラストを独学で開始" },
  { year: "2022", text: "SNSで作品発信、フォロワー1,000人達成" },
  { year: "2023", text: "AIアートに本格参入、独自スタイルを確立" },
  { year: "2024", text: "クライアントワーク開始、累計50件以上" },
];

export default function AboutSection() {
  const data = useSiteData();
  const artistName = data?.artistName || "Hana";
  const bioText = data?.bio || "";
  const profileImage = data?.profileImage;

  return (
    <section
      id="about"
      className="relative overflow-hidden py-20 px-5 sm:px-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Background decorative circles */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-20"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-15"
        style={{ backgroundColor: "var(--color-accent-blue)" }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-2 text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-accent)" }}
          >
            About
          </p>
          <h2
            className="text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            わたしについて
          </h2>
        </motion.div>

        {/* Content: profile + text */}
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center">
          {/* Profile image with decorative ring */}
          <motion.div
            className="mx-auto shrink-0 md:mx-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative h-52 w-52">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full border-4"
                style={{ borderColor: "var(--color-accent)", opacity: 0.4 }}
              />
              {/* Rotated ring */}
              <div
                className="absolute inset-2 rounded-full border-2 border-dashed"
                style={{ borderColor: "var(--color-accent-blue)" }}
              />
              {/* Profile circle */}
              <div
                className="absolute inset-5 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #FFB7C5 0%, #FF7EB3 50%, #C9A0E0 100%)",
                }}
              >
                {/* Emoji face placeholder */}
                <div className="flex h-full w-full items-center justify-center text-5xl">
                  🎨
                </div>
              </div>
              {/* Heart badge */}
              <div
                className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full text-xl shadow-lg"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                💖
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <h3
              className="mb-1 text-2xl font-extrabold"
              style={{ color: "var(--color-text)" }}
            >
              Hana（はな）
            </h3>
            <p
              className="mb-5 text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              イラストレーター / AIアーティスト
            </p>

            {/* Quote */}
            <blockquote className="relative mb-6">
              <span
                className="absolute -top-4 -left-2 text-5xl font-serif leading-none opacity-30"
                style={{ color: "var(--color-accent)" }}
              >
                &ldquo;
              </span>
              <p
                className="relative pl-4 text-base italic leading-relaxed"
                style={{ color: "var(--color-text)" }}
              >
                かわいいと美しいの境界線で、毎日絵を描いています。
                <br />
                AIという道具を使いながら、心を込めた作品を届けたい。
              </p>
            </blockquote>

            <p
              className="mb-6 text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              2021年からデジタルイラストをスタート。パステルカラーと丸みのあるフォルムが持ち味で、
              キャラクターから風景まで幅広く制作。2023年よりAIアートを取り入れ、
              独自のスタイルを確立しました。SNSを中心に作品を発信中です。
            </p>

            {/* Skills tags */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.label}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
                  style={{
                    backgroundColor: skill.bg,
                    color: skill.color,
                    border: `1.5px solid ${skill.color}33`,
                  }}
                >
                  {skill.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4
            className="mb-8 text-center text-lg font-bold"
            style={{ color: "var(--color-text)" }}
          >
            活動の歩み
          </h4>
          <div className="relative mx-auto max-w-2xl">
            {/* Center line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ backgroundColor: "var(--color-border)" }}
            />
            {timelineItems.map((item, index) => (
              <div
                key={item.year}
                className={`relative mb-8 flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } gap-4`}
              >
                {/* Content box */}
                <div className={`flex-1 ${index % 2 === 0 ? "text-right pr-6" : "text-left pl-6"}`}>
                  <div
                    className="inline-block rounded-2xl px-4 py-3"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1.5px solid var(--color-border)",
                    }}
                  >
                    <p
                      className="text-xs font-bold"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {item.year}
                    </p>
                    <p
                      className="mt-0.5 text-sm"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
                {/* Center dot */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-4 z-10"
                  style={{
                    borderColor: "var(--color-accent)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                </div>
                {/* Spacer */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
