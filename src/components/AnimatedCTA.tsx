"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AnimatedCTA({
  href = "/order",
  text = "¥980でサイトを作る →",
  subtext = "ノーコードでOK・最短1日で完了",
}: {
  href?: string;
  text?: string;
  subtext?: string;
}) {
  return (
    <div className="relative flex justify-center py-8">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[400px] h-[120px] bg-primary/20 rounded-full blur-[60px]" />
      </motion.div>

      {/* Button */}
      <Link href={href} className="relative group">
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-primary/40 bg-[#0a0a0f]/90 backdrop-blur-sm px-10 py-5 sm:px-14 sm:py-6"
          whileHover={{ scale: 1.03, borderColor: "rgba(0, 229, 255, 0.7)" }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 229, 255, 0.1)",
              "0 0 40px rgba(0, 229, 255, 0.25)",
              "0 0 20px rgba(0, 229, 255, 0.1)",
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -skew-x-12"
            animate={{
              x: ["-200%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
          />

          {/* Text */}
          <div className="relative text-center">
            <p className="text-primary font-bold text-lg sm:text-xl tracking-wider">
              {text}
            </p>
            <p className="text-text-muted text-xs sm:text-sm mt-1 tracking-wider">
              {subtext}
            </p>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
