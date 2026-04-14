import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * POST /api/ai-edit
 *
 * AI編集API
 * - テスト環境: OpenAI (gpt-4o-mini)
 * - 本番環境: Claude API（将来切替）
 *
 * リクエスト:
 *   answers: { questionId: string, answer: string }[] — 質問への回答（5問分）
 *   currentConfig: object — 現在のsite.config.json
 *   editTarget: "tagline" | "description" | "bio" | "full" — 編集対象
 *
 * レスポンス:
 *   suggestions: { field: string, before: string, after: string }[] — 変更案
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, currentConfig, editTarget } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "回答データが必要です" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // APIキー未設定 → デモモードで仮のレスポンスを返す
      return NextResponse.json({
        suggestions: getDemoSuggestions(editTarget, currentConfig),
        demo: true,
      });
    }

    const openai = new OpenAI({ apiKey });

    // 質問回答からプロンプトを構築
    const answersText = answers
      .map((a: { questionId: string; answer: string }, i: number) => `Q${i + 1}: ${a.answer}`)
      .join("\n");

    const company = currentConfig?.company || {};
    const currentTexts = `
会社名: ${company.name || "未設定"}
現在のキャッチコピー: ${company.tagline || "未設定"}
現在の説明文: ${company.description || "未設定"}
現在の代表挨拶: ${company.bio || "未設定"}
業種: ${currentConfig?.industry || "未設定"}
`.trim();

    const systemPrompt = `あなたは日本の中小企業向けホームページのコピーライターです。
お客様の回答をもとに、サイトのテキストを改善します。

以下のルール:
- 自然な日本語で、堅すぎず砕けすぎない文体
- お客様の業種・雰囲気に合った表現
- 具体的で、その会社にしか使えない言葉を使う
- 汎用的な定型文は避ける
- 1次情報（お客様の実体験・こだわり）を活かす

必ず以下のJSON形式で返してください（他の文章は不要）:
[
  { "field": "tagline", "before": "現在のコピー", "after": "新しいコピー" },
  { "field": "description", "before": "現在の説明文", "after": "新しい説明文" }
]`;

    const userPrompt = `${currentTexts}

お客様の回答:
${answersText}

編集対象: ${editTarget || "full"}

上記をもとに、サイトのテキストを改善してください。`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || "[]";

    // JSONを抽出（```json ... ``` で囲まれている場合も対応）
    let suggestions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      suggestions = getDemoSuggestions(editTarget, currentConfig);
    }

    return NextResponse.json({
      suggestions,
      demo: false,
      usage: {
        prompt_tokens: response.usage?.prompt_tokens || 0,
        completion_tokens: response.usage?.completion_tokens || 0,
      },
    });
  } catch (error) {
    console.error("AI edit error:", error);
    return NextResponse.json(
      { error: "AI編集でエラーが発生しました", suggestions: [] },
      { status: 500 }
    );
  }
}

/**
 * APIキー未設定時のデモ用レスポンス
 */
function getDemoSuggestions(editTarget: string, config: Record<string, unknown>) {
  const company = (config?.company || {}) as Record<string, string>;

  return [
    {
      field: "tagline",
      before: company.tagline || "家族の暮らしに寄り添う家づくり",
      after: "確かな技術で、暮らしを守る。",
    },
    {
      field: "description",
      before: company.description || "東京・世田谷で30年。",
      after: "創業30年。世田谷の街とともに歩んできた、地域密着の工務店です。",
    },
    {
      field: "bio",
      before: company.bio || "",
      after: "お客様の「こんな家に住みたい」を、一棟一棟、丁寧にかたちにしてきました。家づくりは、暮らしづくり。ご家族の未来を想像しながら、最適なプランをご提案します。",
    },
  ].filter((s) => editTarget === "full" || s.field === editTarget);
}
