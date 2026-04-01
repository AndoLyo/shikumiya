"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 4 + Math.random() * 6,
      color: ["#00e5ff", "#d4a853", "#6366f1", "#ec4899", "#22c55e"][
        Math.floor(Math.random() * 5)
      ],
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            rotate: p.rotation,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: p.rotation + 720,
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

const steps = [
  { num: 1, label: "情報入力", done: true },
  { num: 2, label: "お支払い", done: true },
  { num: 3, label: "制作中...", done: false, active: true },
];

export default function OrderSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      {showConfetti && <Confetti />}
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20 flex items-center">
        {/* Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,229,255,0.06),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-[600px] mx-auto px-4 sm:px-6 text-center">
          {/* Success icon */}
          <motion.div
            className="mx-auto w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <motion.svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.path
                d="M8 18L15 25L28 11"
                stroke="#00e5ff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </motion.svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-serif text-white text-2xl sm:text-3xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            お支払いありがとうございます！
          </motion.h1>

          {/* Sub text */}
          <motion.p
            className="mt-4 text-text-secondary text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            サイトの制作を開始します。
            <br />
            完成次第、メールでお知らせします。
          </motion.p>

          {/* Step indicator */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      step.done
                        ? "bg-primary/20 text-primary"
                        : step.active
                          ? "bg-gold/20 text-gold"
                          : "bg-white/[0.06] text-text-muted"
                    }`}
                  >
                    {step.done ? "✓" : step.num}
                  </span>
                  <span
                    className={`text-xs tracking-wider ${
                      step.done
                        ? "text-primary"
                        : step.active
                          ? "text-gold"
                          : "text-text-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span className="text-text-muted/30 text-xs">→</span>
                )}
              </div>
            ))}
          </motion.div>

          {/* Info card */}
          <motion.div
            className="mt-10 glass-card p-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-white text-sm font-bold tracking-wider mb-3">
              今後の流れ
            </h2>
            <ul className="space-y-2.5 text-text-secondary text-[13px] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-primary mt-0.5 shrink-0">01</span>
                <span>いただいた情報をもとにサイトを制作します</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary mt-0.5 shrink-0">02</span>
                <span>完成したらメールでURLをお送りします</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary mt-0.5 shrink-0">03</span>
                <span>内容の修正があればお気軽にご連絡ください</span>
              </li>
            </ul>
          </motion.div>

          {/* Back link */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/[0.1] text-text-secondary text-sm tracking-wider hover:text-white hover:border-white/25 transition-all duration-300"
            >
              ← トップに戻る
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
