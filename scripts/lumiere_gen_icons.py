"""
LUMIÈRE テンプレート用 アイコン生成スクリプト
Gemini API でブランドの世界観に溶け込むカスタムアイコンを生成する。

世界観:
- 漆喰の白い壁、リネン、古い木の家具
- 1pxの繊細な手仕事感
- 色: #A6998C (流木色) / #8B6F5C (革の栞色)
- 温かいが饒舌ではない。静けさの中に存在するもの

アイコンは単純な線画やクリップアートではなく、
水彩やインクスケッチのような有機的な質感を持つ。
"""
import io
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# .env を読み込み
env_paths = [
    Path(r"C:\Users\ryoya\OneDrive\AI\Claude\autonomous\.env"),
    Path(r"C:\Users\ryoya\OneDrive\AI\Claude\SNS_AutoControl_App\.env"),
]
for env_path in env_paths:
    if env_path.exists():
        load_dotenv(env_path)
        break

from google import genai
from google.genai import types
from PIL import Image

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("[ERROR] GEMINI_API_KEY not found in environment")
    sys.exit(1)

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "lumiere"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# モデル優先順
MODELS = [
    os.getenv("GEMINI_MODEL", "gemini-3.1-flash-image-preview"),
    "gemini-3.1-flash-image-preview",
    "gemini-3-pro-image-preview",
    "nano-banana-pro-preview",
]

# ブランド共通のスタイルディレクティブ
BRAND_STYLE = """
[スタイルルール - LUMIÈRE ブランド]
- これは高級プライベート美容サロンのウェブサイト用のビジュアル素材です
- 以下のカラーパレットを厳守してください:
  メイン色: #A6998C (くすんだベージュグレー/流木色)
  アクセント: #8B6F5C (温かいブラウン/革色)
  背景: #F6F3EE (オフホワイト/漆喰色)
- 質感: 水彩画のようなにじみ、または墨絵のような繊細な濃淡
- 線は太くしない。繊細で有機的な筆致
- デジタルっぽさ、クリップアートっぽさは絶対に避ける
- 余白を大切に。要素は画面中央に小さめに配置
- フォトリアルではなく、イラストレーション/スケッチのテイスト
"""

ICON_SPECS = [
    {
        "name": "icon-scissors",
        "prompt": f"""
{BRAND_STYLE}

閉じたハサミを水彩スケッチ風に描いてください。

具体的な指示:
- ハサミはほぼ閉じた状態（刃の角度は15度程度）
- 繊細な1本の線で輪郭を描き、水彩のにじみで陰影をつける
- 色は #A6998C をメインに、影の部分に #8B6F5C を薄く
- 背景は完全な白 (#FFFFFF)
- ハサミの持ち手部分に、使い込まれた革のような温かみのある質感
- 全体サイズは画像の40%程度。周囲に十分な余白
- アイコンっぽさ、記号っぽさを排除。「机の上に置いてあるハサミをスケッチした」感覚
- 正方形の構図（1:1）
""",
        "size": (512, 512),
    },
    {
        "name": "icon-clock",
        "prompt": f"""
{BRAND_STYLE}

アナログ時計を水彩スケッチ風に描いてください。

具体的な指示:
- シンプルな丸い文字盤。数字は書かない
- 針は3時を指す（短針が3、長針が12）。10:10の「笑顔」配置は避ける
- 文字盤の縁は手描きの円。完璧な真円ではなく、わずかに歪んだ有機的な円
- 水彩のにじみで文字盤に柔らかい陰影
- 色は #A6998C メイン、針の色に #8B6F5C
- 背景は完全な白 (#FFFFFF)
- 全体サイズは画像の40%程度。周囲に十分な余白
- 壁掛け時計ではなく、テーブルの上の小さな置時計のスケッチ感
- 正方形の構図（1:1）
""",
        "size": (512, 512),
    },
    {
        "name": "icon-pin",
        "prompt": f"""
{BRAND_STYLE}

地図のピン（マップマーカー）を水彩スケッチ風に描いてください。

具体的な指示:
- ティアドロップ型のマップピン。先端は丸みを帯びている（尖りすぎない）
- 中心に小さな円（窓のように光が入る感覚）
- 水彩のにじみで立体感を出す。べた塗りにしない
- 色は #A6998C メイン、影に #8B6F5C をごく薄く
- 背景は完全な白 (#FFFFFF)
- 全体サイズは画像の40%程度。周囲に十分な余白
- Google Maps のピンではなく、手書きの地図に描かれた目印のような有機的な形
- 正方形の構図（1:1）
""",
        "size": (512, 512),
    },
    {
        "name": "icon-arrow",
        "prompt": f"""
{BRAND_STYLE}

右向きの矢印を水彩スケッチ風に描いてください。

具体的な指示:
- 水平な線の右端に、筆で描いたような45度の矢じり
- 矢じりはV字ではなく、書道の払いのような有機的なカーブ
- 線全体が一筆書きのように繋がっている
- 墨のかすれ（フェザリング）が少し見える繊細な線
- 色は #8B6F5C（アクセントカラー）
- 背景は完全な白 (#FFFFFF)
- 全体サイズは画像の30%程度（矢印は横長なので小さめに）
- デジタルの矢印記号ではなく、手紙の余白に描いた道しるべのような感覚
- 正方形の構図（1:1）
""",
        "size": (512, 512),
    },
]


def generate_icon(client, spec: dict) -> bool:
    """Gemini API でアイコンを生成"""
    output_path = OUTPUT_DIR / f"{spec['name']}.png"
    if output_path.exists():
        print(f"  [SKIP] {spec['name']}.png already exists")
        return True

    print(f"\n  Generating: {spec['name']}...")

    for model_name in MODELS:
        try:
            print(f"    Trying model: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=spec["prompt"],
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                    temperature=0.8,
                ),
            )

            # レスポンスから画像を抽出
            for part in response.candidates[0].content.parts:
                if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                    img = Image.open(io.BytesIO(part.inline_data.data))
                    # リサイズ
                    w, h = spec["size"]
                    img = img.resize((w, h), Image.LANCZOS)
                    img.save(output_path, "PNG", optimize=True)
                    size_kb = output_path.stat().st_size / 1024
                    print(f"    [OK] Saved: {spec['name']}.png ({size_kb:.0f}KB)")
                    return True

            print(f"    [WARN] No image in response from {model_name}")

        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                print(f"    [RATE LIMIT] {model_name}: waiting 30s...")
                import time
                time.sleep(30)
                continue
            print(f"    [ERROR] {model_name}: {error_msg[:100]}")
            continue

    print(f"  [FAIL] Could not generate {spec['name']}")
    return False


def main():
    print("=" * 60)
    print("LUMIÈRE Icon Generator (Gemini API)")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)

    client = genai.Client(api_key=API_KEY)

    success_count = 0
    for i, spec in enumerate(ICON_SPECS):
        print(f"\n[{i+1}/{len(ICON_SPECS)}] {spec['name']}")
        ok = generate_icon(client, spec)
        if ok:
            success_count += 1

    print(f"\n{'=' * 60}")
    print(f"Complete: {success_count}/{len(ICON_SPECS)} icons")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
