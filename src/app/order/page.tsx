"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { templateForms } from "@/lib/template-forms";
import { ChevronLeft, ExternalLink } from "lucide-react";

export default function OrderTemplatePicker() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0f] pt-12 pb-20">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,229,255,0.06),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted text-xs tracking-wider hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>しくみやに戻る</span>
          </Link>
        </motion.div>

        {/* Page title */}
        <motion.div
          className="mt-8 mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-serif text-white text-2xl sm:text-3xl font-bold tracking-wide">
            テンプレートを選んでください
          </h1>
          <p className="text-text-muted text-sm mt-3">
            あなたの作品に合うデザインを選んで、注文に進みましょう
          </p>
        </motion.div>

        {/* Template Grid */}
        <motion.div
          className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {templateForms.map((tpl, idx) => (
            <motion.div
              key={tpl.id}
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * idx }}
            >
              <button
                type="button"
                onClick={() => router.push(`/order/${tpl.id}`)}
                className="group rounded-xl overflow-hidden border border-white/[0.06] hover:border-primary/50 transition-all duration-300 text-left hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Preview */}
                <div
                  className="h-28 sm:h-32 relative overflow-hidden"
                  style={{ background: tpl.defaultColors.background }}
                >
                  <Image
                    src={`/previews/${tpl.id}.webp`}
                    alt={tpl.nameJa}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 20vw"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Color dots */}
                  <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ background: tpl.defaultColors.primary }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ background: tpl.defaultColors.accent }}
                    />
                  </div>
                </div>
                <div className="px-3 py-2.5 bg-[#0d0d15]">
                  <p className="text-xs tracking-wider font-medium text-text-secondary group-hover:text-primary transition-colors">
                    {tpl.nameJa}
                  </p>
                  <p className="text-[9px] text-text-muted mt-0.5 leading-tight">
                    {tpl.description}
                  </p>
                </div>
              </button>
              <a
                href={`/portfolio-templates/${tpl.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-center gap-1 text-[10px] text-text-muted hover:text-primary transition-colors"
              >
                デモを見る <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
