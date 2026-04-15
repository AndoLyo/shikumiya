"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import LoginModal from "@/components/LoginModal";

export default function MemberLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  // ログイン済みなら自動遷移
  useEffect(() => {
    if (status === "authenticated" && session) {
      const email = session.user?.email;
      if (email) {
        sessionStorage.setItem("memberEmail", email);
      }

      if (session.orderId) {
        // セッションに注文あり → ダッシュボードへ
        router.push(`/member/${encodeURIComponent(session.orderId)}`);
        return;
      }

      // セッションに注文がない → GASに直接問い合わせ
      if (email) {
        fetch(`/api/member/find?email=${encodeURIComponent(email)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.found && data.orders?.length > 0) {
              // 注文あり → ダッシュボードへ
              router.push(`/member/${encodeURIComponent(data.orders[0].orderId)}`);
            } else {
              // 注文なし → サイト作成画面へ
              router.push("/start");
            }
          })
          .catch(() => {
            router.push("/start");
          });
        return;
      }

      router.push("/start");
      return;
    }
    // 未ログインなら自動でモーダルを開く
    if (status === "unauthenticated") {
      setLoginOpen(true);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  // ログイン済みだが注文なし
  const isLoggedInNoOrder = status === "authenticated" && !session?.orderId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf2f8] via-[#f3f0ff] to-[#fff7ed] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-800 font-bold">しくみや</span>
        </Link>

        {isLoggedInNoOrder ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-800 font-bold text-sm">注文データが見つかりません</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              {session?.user?.email} に紐づく注文がありません。
              <br />お申し込み時のアカウントでログインしてください。
            </p>
            <button
              onClick={() => setLoginOpen(true)}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
            >
              別のアカウントで試す
            </button>
            <Link href="/start" className="text-purple-500 text-xs hover:underline block">
              まだ申し込んでいない方はこちら
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <p className="text-gray-500 text-sm mb-4">ログインしてサイトを管理</p>
            <button
              onClick={() => setLoginOpen(true)}
              className="w-full bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white font-bold rounded-xl py-3.5 hover:opacity-90 transition-all text-sm"
            >
              ログイン
            </button>
          </div>
        )}

        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors mt-6 inline-block">
          トップページに戻る
        </Link>
      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
