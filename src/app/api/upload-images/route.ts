import { NextRequest, NextResponse } from "next/server";

/**
 * 画像を1枚ずつGitHub Gistにアップロードするエンドポイント。
 * フロントから画像1枚ごとに呼ばれる。
 * gistIdが空なら新規Gist作成、あればファイル追加。
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gistId, fileName, imageData, orderId } = body;

    if (!fileName || !imageData) {
      return NextResponse.json(
        { error: "fileName and imageData are required" },
        { status: 400 },
      );
    }

    const githubToken = process.env.GITHUB_TOKEN!;

    if (!gistId) {
      // Create a new Gist with this image
      const res = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: `しくみや画像データ: ${orderId || "upload"}`,
          public: false,
          files: {
            [fileName]: { content: imageData },
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Gist creation failed:", err);
        return NextResponse.json({ error: "画像の保存に失敗しました" }, { status: 500 });
      }

      const data = await res.json();
      return NextResponse.json({ gistId: data.id });
    } else {
      // Add file to existing Gist
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            [fileName]: { content: imageData },
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Gist update failed:", err);
        return NextResponse.json({ error: "画像の追加に失敗しました" }, { status: 500 });
      }

      return NextResponse.json({ gistId });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
  }
}
