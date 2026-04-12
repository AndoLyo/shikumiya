"""
画像自動分類・カルーセル順序決定
Gemini APIの画像認識で画像タイプを判定し、最適な順序に並べる
"""
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


# カルーセルの順序ルール（優先度順）
ORDER_PRIORITY = {
    "thumbnail": 0,    # ちびキャラサムネ → 必ず1枚目
    "result": 1,       # 結果画面・出力 → 2番目（最も重要な証拠）
    "diagram": 2,      # 図解・フロー図 → 3番目
    "screenshot": 3,   # スクショ → 4番目以降（手順の補足）
    "unknown": 4,      # 不明 → 最後
}


def classify_images(image_paths: list[str], gemini_api_key: str = None) -> list[dict]:
    """画像を分類して最適な順序で返す

    Args:
        image_paths: 画像パスのリスト
        gemini_api_key: Gemini APIキー（Noneならファイル名ベースで判定）

    Returns:
        [{"path": "...", "type": "thumbnail", "order": 0, "description": "..."}, ...]
    """
    results = []

    for img_path in image_paths:
        img_type = _classify_by_filename(img_path)

        # ファイル名で判定できない場合、Gemini APIで画像認識
        if img_type == "unknown" and gemini_api_key:
            img_type, description = _classify_by_gemini(img_path, gemini_api_key)
        else:
            description = ""

        results.append({
            "path": img_path,
            "type": img_type,
            "order": ORDER_PRIORITY.get(img_type, 4),
            "description": description,
        })

    # 順序でソート
    results.sort(key=lambda x: x["order"])

    logger.info(f"画像分類完了: {[(r['type'], Path(r['path']).name) for r in results]}")
    return results


def _classify_by_filename(path: str) -> str:
    """ファイル名から画像タイプを推定"""
    name = Path(path).stem.lower()

    if any(kw in name for kw in ["thumb", "chibi", "sns_", "サムネ", "cover"]):
        return "thumbnail"
    if any(kw in name for kw in ["diagram", "flow", "図", "chart"]):
        return "diagram"
    if any(kw in name for kw in ["screenshot", "screen", "ss", "スクショ", "capture"]):
        return "screenshot"
    if any(kw in name for kw in ["result", "output", "結果"]):
        return "result"

    return "unknown"


def _classify_by_gemini(path: str, api_key: str) -> tuple[str, str]:
    """Gemini APIで画像を分析して分類する"""
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        with open(path, "rb") as f:
            img_data = f.read()

        mime = "image/png" if path.lower().endswith(".png") else "image/jpeg"

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Part.from_bytes(data=img_data, mime_type=mime),
                """この画像を以下のカテゴリの1つに分類してください。
カテゴリ名だけ1行目に、簡単な説明を2行目に出力してください。

カテゴリ:
- thumbnail: イラスト、キャラクター画像、サムネイル用の画像
- diagram: 図解、フロー図、チャート、構成図
- screenshot: アプリやターミナルのスクリーンショット
- result: 実行結果、出力画面、Before/After

出力例:
screenshot
Claude Codeのターミナル画面。作業状態の更新コマンドが表示されている。""",
            ],
            config=types.GenerateContentConfig(response_modalities=["TEXT"]),
        )

        text = response.candidates[0].content.parts[0].text.strip()
        lines = text.split("\n", 1)
        img_type = lines[0].strip().lower()
        description = lines[1].strip() if len(lines) > 1 else ""

        if img_type not in ORDER_PRIORITY:
            img_type = "unknown"

        logger.info(f"  [Gemini分類] {Path(path).name} → {img_type}: {description[:50]}")
        return img_type, description

    except Exception as e:
        logger.warning(f"  [Gemini分類] 失敗: {e}")
        return "unknown", ""
