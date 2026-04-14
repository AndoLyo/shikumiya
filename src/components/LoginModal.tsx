"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { X, Mail, Lock, ArrowRight, Loader2, AlertCircle, UserPlus } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 初期表示モード。"register" で新規登録画面から開始 */
  initialMode?: "select" | "register";
  /** 認証成功後のリダイレクト先。デフォルトは /member */
  callbackUrl?: string;
}

export default function LoginModal({ isOpen, onClose, initialMode = "select", callbackUrl = "/member" }: LoginModalProps) {
  const [mode, setMode] = useState<"select" | "email" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが間違っています");
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (password.length < 6) {
      setError("パスワードは6文字以上にしてください");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "登録に失敗しました");
        setLoading(false);
        return;
      }

      // 登録成功 → そのままログイン
      const loginResult = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setError("登録は完了しましたが、ログインに失敗しました。メールアドレスでログインしてください。");
        setMode("email");
        setLoading(false);
      } else {
        window.location.href = callbackUrl;
      }
    } catch {
      setError("通信エラーが発生しました");
      setLoading(false);
    }
  }

  function handleOAuthLogin(provider: string) {
    signIn(provider, { callbackUrl });
  }

  function switchToRegister() {
    setMode("register");
    setError("");
    setPasswordConfirm("");
  }

  function switchToLogin() {
    setMode("select");
    setError("");
    setPasswordConfirm("");
  }

  const isRegister = mode === "register";
  const title = isRegister ? "新規登録" : "ログイン";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-gray-800 font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {mode === "email" || mode === "register" ? (
            /* メール + パスワード（ログイン or 新規登録） */
            <form onSubmit={isRegister ? handleRegister : handleEmailLogin} className="space-y-4 pt-2">
              <button
                type="button"
                onClick={switchToLogin}
                className="text-gray-400 text-xs hover:text-gray-600"
              >
                ← 戻る
              </button>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレス" required autoFocus
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード" required minLength={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 text-sm"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="パスワード（確認）" required minLength={6}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 text-sm"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-[#e84393] via-[#6c5ce7] to-[#f39c12] text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all text-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>{isRegister ? "登録する" : "ログイン"} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center">
                {isRegister ? (
                  <button type="button" onClick={() => { setMode("email"); setError(""); }} className="text-purple-500 text-xs hover:underline">
                    アカウントをお持ちの方はこちら
                  </button>
                ) : (
                  <button type="button" onClick={switchToRegister} className="text-purple-500 text-xs hover:underline">
                    新規登録はこちら
                  </button>
                )}
              </p>
            </form>
          ) : (
            /* ログイン方法選択 */
            <div className="space-y-2.5 pt-2">
              <button onClick={() => handleOAuthLogin("google")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                <GoogleIcon /> Googleで{isRegister ? "登録" : "ログイン"}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-gray-300 text-xs">または</span></div>
              </div>

              <button onClick={() => setMode("email")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                <Mail className="w-4.5 h-4.5" /> メールアドレスでログイン
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-gray-300 text-xs">初めての方</span></div>
              </div>

              <button onClick={switchToRegister}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-purple-200 text-purple-600 text-sm font-medium hover:bg-purple-50 transition-colors">
                <UserPlus className="w-4.5 h-4.5" /> 新規登録
              </button>

              <p className="text-gray-400 text-[11px] text-center pt-1">
                サイト作成はすぐに始められます
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}
