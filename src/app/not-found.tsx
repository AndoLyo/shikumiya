import Link from "next/link";

export const metadata = {
  title: "ページが見つかりません | しくみや",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative number */}
      <p className="font-serif text-[120px] sm:text-[180px] font-bold leading-none text-white/[0.04] select-none">
        404
      </p>

      {/* Message */}
      <div className="-mt-16 sm:-mt-24 relative z-10">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
          ページが見つかりません
        </h1>
        <p className="text-text-secondary text-sm max-w-[400px] mx-auto mb-8 leading-relaxed">
          お探しのページは移動または削除された可能性があります。
        </p>

        {/* Navigation links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-xl bg-primary text-[#0a0a0f] font-bold text-sm tracking-wider hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            トップページに戻る
          </Link>
          <Link
            href="/templates"
            className="px-8 py-3 rounded-xl border border-white/[0.08] text-text-secondary text-sm tracking-wider hover:text-white hover:border-white/20 transition-all duration-300"
          >
            テンプレート集を見る
          </Link>
        </div>
      </div>

      {/* Decorative line */}
      <div className="mt-16 flex items-center gap-3">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/30" />
      </div>
    </main>
  );
}
