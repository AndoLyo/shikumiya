import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

/**
 * POST /api/ai-edit
 *
 * AI編集API — OpenAI / Claude 自動切替
 *
 * 優先順位:
 *   1. ANTHROPIC_API_KEY があれば Claude（本番用）
 *   2. OPENAI_API_KEY があれば OpenAI（テスト用）
 *   3. どちらもなければデモモード
 *
 * リクエスト:
 *   answers: { questionId: string, answer: string }[]
 *   currentConfig: object
 *   editTarget: "tagline" | "description" | "bio" | "full"
 *
 * レスポンス:
 *   suggestions: { field: string, before: string, after: string }[]
 *   provider: "claude" | "openai" | "demo"
 */

const SYSTEM_PROMPT = `あなたは日本の中小企業向けホームページのコピーライターです。
お客様の回答をもとに、サイトのテキストを改善します。

以下のルール:
- 自然な日本語で、堅すぎず砕けすぎない文体
- お客様の業種・雰囲気に合った表現
- 具体的で、その会社にしか使えない言葉を使う
- 汎用的な定型文は避ける
- 1次情報（お客様の実体験・こだわり）を活かす

必ず以下のJSON形式「のみ」で返してください。説明文や前置きは不要です:
[
  { "field": "tagline", "before": "現在のコピー", "after": "新しいコピー" },
  { "field": "description", "before": "現在の説明文", "after": "新しい説明文" },
  { "field": "bio", "before": "現在の挨拶文", "after": "新しい挨拶文" }
]`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, currentConfig, editTarget } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "回答データが必要です" }, { status: 400 });
    }

    // プロンプト構築
    const answersText = answers
      .map((a: { questionId: string; answer: string }, i: number) => `Q${i + 1}: ${a.answer}`)
      .join("\n");

    const company = (currentConfig?.company || {}) as Record<string, string>;
    const userPrompt = `会社名: ${company.name || "未設定"}
現在のキャッチコピー: ${company.tagline || "未設定"}
現在の説明文: ${company.description || "未設定"}
現在の代表挨拶: ${company.bio || "未設定"}
業種: ${(currentConfig as Record<string, string>)?.industry || "未設定"}

お客様の回答:
${answersText}

編集対象: ${editTarget || "full"}

上記をもとに、サイトのテキストを改善してください。JSON形式のみで返してください。`;

    // --- Claude API（本番用） ---
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const anthropic = new Anthropic({ apiKey: anthropicKey });
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        });

        const content = response.content[0]?.type === "text" ? response.content[0].text : "[]";
        const suggestions = parseJsonResponse(content, editTarget, company);

        return NextResponse.json({
          suggestions,
          provider: "claude",
          usage: {
            input_tokens: response.usage?.input_tokens || 0,
            output_tokens: response.usage?.output_tokens || 0,
          },
        });
      } catch (claudeErr) {
        console.error("Claude API error:", claudeErr);
        // Claudeが失敗したらOpenAIにフォールバック
      }
    }

    // --- OpenAI API（テスト用） ---
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || "[]";
        const suggestions = parseJsonResponse(content, editTarget, company);

        return NextResponse.json({
          suggestions,
          provider: "openai",
          usage: {
            prompt_tokens: response.usage?.prompt_tokens || 0,
            completion_tokens: response.usage?.completion_tokens || 0,
          },
        });
      } catch (openaiErr) {
        console.error("OpenAI API error:", openaiErr);
      }
    }

    // --- デモモード ---
    return NextResponse.json({
      suggestions: getDemoSuggestions(editTarget, company),
      provider: "demo",
    });

  } catch (error) {
    console.error("AI edit error:", error);
    return NextResponse.json(
      { error: "AI編集でエラーが発生しました", suggestions: getDemoSuggestions("full", {}) },
      { status: 500 }
    );
  }
}

/**
 * AIレスポンスからJSON配列を抽出する
 */
function parseJsonResponse(
  content: string,
  editTarget: string,
  company: Record<string, string>
): { field: string; before: string; after: string }[] {
  try {
    // ```json ... ``` で囲まれている場合も対応
    const jsonMatch = content.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return editTarget === "full" ? parsed : parsed.filter((s: { field: string }) => s.field === editTarget);
      }
    }
  } catch (e) {
    console.error("JSON parse error:", e, "content:", content);
  }
  return getDemoSuggestions(editTarget, company);
}

/**
 * APIキー未設定 or エラー時のデモ用レスポンス
 */
function getDemoSuggestions(editTarget: string, company: Record<string, string>) {
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
      after: "お客様の「こんな家に住みたい」を、一棟一棟、丁寧にかたちにしてきました。",
    },
  ].filter((s) => editTarget === "full" || s.field === editTarget);
}
