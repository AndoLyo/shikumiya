"""
note記事用 画像自動生成モジュール

記事フォルダの thumbnails.md（またはサムネイル.md）からプロンプトを読み取り、
Gemini API で サムネイル + セクション画像 を一括生成する。

キャラクターと図解の比率ルール:
  - サムネイル: キャラクター7 : 図解3（ちびデフォルメキャラ + パッと見でわかる構図）
  - セクション画像: キャラクター1〜2 : 図解8〜9（図解メイン、ちびキャラは小さく添える程度）

使い方（モジュールとして）:
    from actions.generate_images import generate_article_images
    results = generate_article_images("path/to/012_パステルポップ")

使い方（CLI）:
    python -m actions.generate_images --folder "012_パステルポップ"
    python -m actions.generate_images --folder "012_パステルポップ" --force  # 既存上書き
"""
import io
import logging
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv
from PIL import Image

# .env 読み込み（SNS_AutoControl_App/.env）
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

log = logging.getLogger(__name__)

# ═══════════════════════════════════════
#  設定
# ═══════════════════════════════════════

API_KEY = os.getenv("GEMINI_API_KEY")
ENV_MODEL = os.getenv("GEMINI_MODEL", "gemini-3-pro-image-preview")

# モデル優先順（.envのモデルを最優先、フォールバック付き）
MODELS = [ENV_MODEL]
for _m in ["gemini-3-pro-image-preview", "nano-banana-pro-preview", "gemini-2.5-flash-image"]:
    if _m not in MODELS:
        MODELS.append(_m)

THUMB_W, THUMB_H = 1280, 670
SECTION_W, SECTION_H = 1280, 720

NOTE_DRAFTS_BASE = Path(r"C:\Users\ryoya\OneDrive\AI\Claude\note-drafts\publish-ready")

# キャラクター参照画像（三面図）
CHARACTER_REF_IMAGE = Path(r"C:\Users\ryoya\OneDrive\AI\Claude\autonomous\assets\02083.jpg")

# ═══════════════════════════════════════
#  キャラクター比率ルール
# ═══════════════════════════════════════

# サムネイル用: 図解メイン、キャラは添える程度
THUMBNAIL_CHARACTER_DIRECTIVE = (
    "\n\n[キャラクタールール] これはサムネイル画像です。"
    "図解・インフォグラフィックをメインにしてください（画像面積の70〜80%）。"
    "添付の参照画像のキャラクターを、ちびデフォルメ（SDキャラ・2〜3頭身）で小さく添えてください（画像面積の20〜30%）。"
    "キャラクターは右下または右端に配置。"
    "キャラクターはリアルにしない。必ずちびデフォルメスタイルで。"
    "テキストや図解の視認性を最優先にしてください。"
)

# セクション画像用: 図解が主役、キャラは極小アクセント
SECTION_CHARACTER_DIRECTIVE = (
    "\n\n[キャラクタールール] これはセクション画像（記事内の見出し画像）です。"
    "図解・インフォグラフィックが主役です（画像面積の85〜95%）。"
    "添付の参照画像のキャラクターを使う場合は、ちびデフォルメ（SDキャラ・2頭身）で"
    "隅に極小サイズ（画像面積の5〜15%）で配置してください。"
    "キャラクターは小さなアクセントであり、主役ではありません。"
    "プロンプトにキャラクターの指定がなければ、キャラクターを追加しないでください。"
    "図解の情報が正確に伝わることを最優先にしてください。"
)


# ═══════════════════════════════════════
#  プロンプト解析（thumbnails.md / サムネイル.md）
# ═══════════════════════════════════════

def parse_prompts(folder: Path) -> list[dict]:
    """thumbnails.md（またはサムネイル.md）からプロンプト定義を抽出する。

    Returns:
        [{"filename": "thumbnail", "type": "thumbnail"|"section", "prompt": str}, ...]
    """
    prompts_path = folder / "thumbnails.md"
    if not prompts_path.exists():
        prompts_path = folder / "サムネイル.md"
    if not prompts_path.exists():
        log.warning(f"プロンプトファイルが見つかりません: {folder}")
        return []

    content = prompts_path.read_text(encoding="utf-8")
    items = []

    # ``` ブロックを順番に抽出し、直前の見出しからファイル名を推定
    blocks = re.split(r'(#{1,3}\s+[^\n]+)', content)

    current_heading = ""
    for block in blocks:
        block = block.strip()
        if not block:
            continue

        # 見出し行
        if re.match(r'^#{1,3}\s+', block):
            current_heading = block
            continue

        # コードブロック抽出
        code_matches = re.findall(r'```\s*\n(.*?)\n```', block, re.DOTALL)
        for prompt_text in code_matches:
            prompt_text = prompt_text.strip()
            if not prompt_text:
                continue

            # ファイル名推定
            filename, img_type = _infer_filename(current_heading, prompt_text)
            items.append({
                "filename": filename,
                "type": img_type,
                "prompt": prompt_text,
            })

    log.info(f"[画像生成] プロンプト {len(items)}件を解析")
    return items


def _infer_filename(heading: str, prompt: str) -> tuple[str, str]:
    """見出し・プロンプトのメタデータ・プロンプト内容からファイル名と種類を推定"""
    heading_lower = heading.lower()

    # === 1. プロンプト内の prompt_name / prompt_type メタデータ（最優先） ===
    name_match = re.search(r'prompt_name:\s*(\S+)', prompt)
    type_match = re.search(r'prompt_type:\s*(\S+)', prompt)
    if name_match:
        pname = name_match.group(1).strip()
        ptype = type_match.group(1).strip() if type_match else "section"
        # メタデータ行をプロンプトから除去しない（Geminiは無視してくれる）
        return pname, ptype

    # === 2. 見出しから推定 ===
    # サムネイル
    if "サムネ" in heading or "thumbnail" in heading_lower:
        return "thumbnail", "thumbnail"

    # section_XX.png — 見出しから番号を抽出
    num_match = re.search(r'section[_\s]*(\d+)', heading_lower)
    if num_match:
        return f"section_{num_match.group(1).zfill(2)}", "section"

    # セクション_XX — 日本語
    num_match = re.search(r'セクション[_\s]*(\d+)', heading)
    if num_match:
        return f"section_{num_match.group(1).zfill(2)}", "section"

    # ファイル名が見出しに明記されている場合
    file_match = re.search(r'(section_\d+)\.png', heading)
    if file_match:
        return file_match.group(1), "section"

    # === 3. プロンプト内容から判断 ===
    if "thumbnail" in prompt.lower() or "サムネ" in prompt:
        return "thumbnail", "thumbnail"

    return "unknown", "section"


# ═══════════════════════════════════════
#  Gemini API 画像生成
# ═══════════════════════════════════════

def _generate_image(prompt: str) -> bytes | None:
    """Gemini APIで画像を生成。キャラクター参照画像を添付。モデル優先順でフォールバック。"""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=API_KEY)

    # コンテンツ構築: 参照画像 + プロンプト（常に添付）
    contents = []
    if CHARACTER_REF_IMAGE.exists():
        ref_bytes = CHARACTER_REF_IMAGE.read_bytes()
        contents.append(types.Part.from_bytes(data=ref_bytes, mime_type="image/jpeg"))
        log.debug("    参照画像を添付")
    contents.append(prompt)

    for model in MODELS:
        log.debug(f"    モデル: {model}")
        try:
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_modalities=["TEXT", "IMAGE"],
                    image_config=types.ImageConfig(
                        aspect_ratio="16:9",
                        image_size="2K",
                    ),
                ),
            )

            for part in response.candidates[0].content.parts:
                if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                    log.debug(f"    成功: {model}")
                    return part.inline_data.data

            log.debug(f"    画像なし、次のモデルへ...")

        except Exception as e:
            log.warning(f"    生成エラー ({model}): {e}")
            continue

    return None


def _resize_and_crop(image_data: bytes, target_w: int, target_h: int) -> Image.Image:
    """リサイズ＆センタークロップで指定サイズに確定"""
    img = Image.open(io.BytesIO(image_data))
    img_ratio = img.width / img.height
    target_ratio = target_w / target_h

    if img_ratio > target_ratio:
        new_height = target_h
        new_width = int(target_h * img_ratio)
    else:
        new_width = target_w
        new_height = int(target_w / img_ratio)

    img = img.resize((new_width, new_height), Image.LANCZOS)
    left = (new_width - target_w) // 2
    top = (new_height - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))


# ═══════════════════════════════════════
#  メイン関数
# ═══════════════════════════════════════

def generate_article_images(
    folder_path: str,
    force: bool = False,
) -> list[dict]:
    """記事フォルダの画像を一括生成する。

    Args:
        folder_path: 記事フォルダのパス
        force: True なら既存画像を上書き

    Returns:
        [{"name": str, "path": str|None, "status": "OK"|"SKIP"|"FAILED"}, ...]
    """
    if not API_KEY:
        log.error("GEMINI_API_KEY が設定されていません")
        return []

    folder = Path(folder_path)
    images_dir = folder / "images"
    if not images_dir.exists():
        # 日本語フォルダ名対応
        images_dir = folder / "画像"
    images_dir.mkdir(parents=True, exist_ok=True)

    # プロンプト解析
    items = parse_prompts(folder)
    if not items:
        log.warning("プロンプトが見つかりません")
        return []

    log.info(f"モデル優先順: {' → '.join(MODELS)}")
    log.info(f"生成対象: {len(items)}枚")

    results = []
    for item in items:
        name = item["filename"]
        img_type = item["type"]

        # 出力パス決定
        if name == "thumbnail":
            filepath = folder / "thumbnail.png"
            tw, th = THUMB_W, THUMB_H
        else:
            filepath = images_dir / f"{name}.png"
            tw, th = SECTION_W, SECTION_H

        # 既存チェック
        if filepath.exists() and not force:
            log.info(f"スキップ（既存）: {name}")
            results.append({"name": name, "path": str(filepath), "status": "SKIP"})
            continue

        # キャラクター比率ルールをプロンプトに追加
        prompt = item["prompt"]
        if img_type == "thumbnail":
            prompt += THUMBNAIL_CHARACTER_DIRECTIVE
        else:
            prompt += SECTION_CHARACTER_DIRECTIVE

        # 生成
        log.info(f"生成中: {name} ({img_type})...")
        img_data = _generate_image(prompt)
        if not img_data:
            log.error(f"  失敗: {name}")
            results.append({"name": name, "path": None, "status": "FAILED"})
            continue

        # リサイズ＆保存
        img = _resize_and_crop(img_data, tw, th)
        img.save(filepath, "PNG", quality=95)
        log.info(f"  保存: {filepath} ({img.size[0]}x{img.size[1]})")
        results.append({"name": name, "path": str(filepath), "status": "OK"})

    return results


# ═══════════════════════════════════════
#  CLI エントリーポイント
# ═══════════════════════════════════════

def main():
    import argparse

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

    parser = argparse.ArgumentParser(description="note記事用 画像自動生成")
    parser.add_argument("--folder", type=str, required=True, help="記事フォルダ名（例: 012_パステルポップ）")
    parser.add_argument("--force", action="store_true", help="既存画像を上書き")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )

    folder = NOTE_DRAFTS_BASE / args.folder
    if not folder.exists():
        log.error(f"フォルダが見つかりません: {folder}")
        sys.exit(1)

    results = generate_article_images(str(folder), force=args.force)

    print("\n" + "=" * 50)
    print("結果:")
    ok = sum(1 for r in results if r["status"] == "OK")
    skip = sum(1 for r in results if r["status"] == "SKIP")
    fail = sum(1 for r in results if r["status"] == "FAILED")
    for r in results:
        print(f"  [{r['status']}] {r['name']}: {r.get('path') or 'N/A'}")
    print(f"\n生成: {ok}  スキップ: {skip}  失敗: {fail}")


if __name__ == "__main__":
    main()
