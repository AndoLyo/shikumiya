import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/register
 * GAS の register_user アクションを呼び出して新規ユーザーを登録する。
 * 登録後、NextAuth の credentials でログインする。
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードを入力してください" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "パスワードは6文字以上にしてください" },
        { status: 400 }
      );
    }

    const gasUrl = process.env.GAS_WEBHOOK_URL;
    if (!gasUrl) {
      return NextResponse.json(
        { error: "サーバー設定エラー" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `${gasUrl}?action=register_user&email=${encodeURIComponent(email.trim())}&password=${encodeURIComponent(password)}`
    );
    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || "登録に失敗しました" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "登録処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
