import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表示 | しくみや by Lyo Vision",
  description:
    "しくみや by Lyo Vision の特定商取引法に基づく表示ページです。",
};

const rows = [
  { label: "販売事業者", value: "Lyo Vision" },
  { label: "代表者", value: "Lyo" },
  {
    label: "所在地",
    value: "請求があった場合に遅滞なく開示いたします",
  },
  {
    label: "連絡先",
    value:
      "メール: ando.lyo.ai@gmail.com\n※お問い合わせはメールにてお願いいたします",
  },
  { label: "販売URL", value: "https://lyo-vision.com", isLink: true },
  {
    label: "販売価格",
    value:
      "制作費: 0円\nおまかせプラン: ¥3,000/月（税込）\nまるっとおまかせプラン: ¥8,000/月（税込）\nぜんぶおまかせプラン: ¥15,000〜/月（税込）",
  },
  { label: "支払い方法", value: "クレジットカード（Stripe経由）" },
  {
    label: "支払い時期",
    value:
      "全プラン: 毎月自動引き落とし（クレジットカード）",
  },
  {
    label: "商品の引き渡し時期",
    value:
      "お申し込み後、写真をお送りいただいてから最短翌営業日",
  },
  {
    label: "返品・キャンセル",
    value:
      "いつでも解約可能です（解約月末までサイトは公開されます）。制作費は0円のため初期費用の返金はありません。",
  },
  {
    label: "動作環境",
    value: "モダンブラウザ（Chrome, Safari, Firefox, Edge の最新版）",
  },
] as const;

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="mx-auto max-w-[800px] px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-white transition-colors duration-300 mb-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            しくみや トップに戻る
          </Link>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            特定商取引法に基づく表示
          </h1>
        </div>

        {/* Table */}
        <dl className="divide-y divide-white/[0.06]">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-5"
            >
              <dt className="text-text-muted text-sm font-medium">
                {row.label}
              </dt>
              <dd className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {"isLink" in row && row.isLink ? (
                  <a
                    href={row.value}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        {/* Decorative line */}
        <div className="mt-16 flex items-center justify-center gap-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/30" />
        </div>
      </div>
    </main>
  );
}
