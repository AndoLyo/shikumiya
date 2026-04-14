"""
LUMIÈRE テンプレート用 画像取得スクリプト
Playwright で Unsplash から美容サロン系の写真をダウンロードする。
全て異なる写真を使い、使い回さない。
"""
import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "lumiere"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 各セクション用の検索クエリと保存名
# 全て異なるクエリで異なる画像を取得する
IMAGE_SPECS = [
    {
        "name": "hero",
        "query": "hair salon interior morning light window empty chair",
        "desc": "Hero: 朝の光が差す施術席と窓",
    },
    {
        "name": "mirror",
        "query": "salon mirror reflection plants natural light",
        "desc": "鏡越しの店内。植物と光",
    },
    {
        "name": "style-1",
        "query": "woman back view hairstyle natural light brunette",
        "desc": "スタイル写真1: 後ろ姿",
    },
    {
        "name": "style-2",
        "query": "woman side profile hairstyle soft light blonde",
        "desc": "スタイル写真2: 横顔",
    },
    {
        "name": "style-3",
        "query": "woman touching hair back view warm tone",
        "desc": "スタイル写真3: 髪に触れる後ろ姿",
    },
    {
        "name": "style-4",
        "query": "short hair woman side view minimalist",
        "desc": "スタイル写真4: ショートヘア横顔",
    },
    {
        "name": "style-5",
        "query": "woman hair back sunlight golden hour portrait",
        "desc": "スタイル写真5: 光の中の後ろ姿",
    },
    {
        "name": "style-6",
        "query": "woman elegant updo hairstyle side natural",
        "desc": "スタイル写真6: アップスタイル横顔",
    },
    {
        "name": "stylist",
        "query": "hair stylist working side view scissors salon",
        "desc": "スタイリスト: 施術中の横顔",
    },
    {
        "name": "staff-hands-1",
        "query": "hairdresser hands styling hair close up warm",
        "desc": "スタッフ1: 髪をスタイリングする手元",
    },
    {
        "name": "staff-hands-2",
        "query": "barista pouring coffee latte art hands",
        "desc": "スタッフ2: コーヒーを淹れる手元",
    },
    {
        "name": "menu-bg",
        "query": "white towel wooden counter comb salon minimal",
        "desc": "メニュー背景: カウンターのタオルとコーム",
    },
    {
        "name": "cta-bg",
        "query": "empty chair window golden hour evening warm salon",
        "desc": "CTA背景: 夕方の光の窓辺",
    },
]


async def download_image_from_unsplash(page, spec: dict, index: int) -> bool:
    """Unsplash から画像を検索してダウンロードする"""
    output_path = OUTPUT_DIR / f"{spec['name']}.jpg"
    if output_path.exists():
        print(f"  [SKIP] {spec['name']}.jpg already exists")
        return True

    query = spec["query"]
    print(f"\n[{index+1}/{len(IMAGE_SPECS)}] {spec['desc']}")
    print(f"  Query: {query}")

    try:
        # Unsplash 検索ページへ
        search_url = f"https://unsplash.com/s/photos/{query.replace(' ', '-')}"
        await page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)

        # 画像一覧を取得 (index番目の異なる画像を選ぶ)
        img_elements = await page.query_selector_all('figure img[srcset]')

        if not img_elements:
            # fallback: src属性を持つ img を探す
            img_elements = await page.query_selector_all('img[src*="images.unsplash.com"]')

        if len(img_elements) < 1:
            print(f"  [WARN] No images found for: {query}")
            return False

        # 最初の数枚をスキップして index 番目を選択（使い回し防止）
        pick_index = min(index % max(len(img_elements), 1), len(img_elements) - 1)
        target_img = img_elements[pick_index]

        # srcset から最大画像URLを取得
        srcset = await target_img.get_attribute("srcset") or ""
        src = await target_img.get_attribute("src") or ""

        # srcset からURLを抽出
        img_url = ""
        if srcset:
            parts = srcset.split(",")
            # 最大幅のものを選択
            for part in reversed(parts):
                url_part = part.strip().split(" ")[0]
                if "images.unsplash.com" in url_part:
                    img_url = url_part
                    break

        if not img_url and src and "images.unsplash.com" in src:
            img_url = src

        if not img_url:
            print(f"  [WARN] Could not extract image URL")
            return False

        # URL を高品質版に変換
        base_url = img_url.split("?")[0]
        download_url = f"{base_url}?w=1280&q=80&fit=crop&auto=format"

        print(f"  Downloading: {download_url[:80]}...")

        # 画像をダウンロード
        response = await page.request.get(download_url)
        if response.ok:
            content = await response.body()
            output_path.write_bytes(content)
            size_kb = len(content) / 1024
            print(f"  [OK] Saved: {output_path.name} ({size_kb:.0f}KB)")
            return True
        else:
            print(f"  [FAIL] HTTP {response.status}")
            return False

    except Exception as e:
        print(f"  [ERROR] {e}")
        return False


async def main():
    print("=" * 60)
    print("LUMIÈRE Image Fetcher")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await context.new_page()

        success_count = 0
        for i, spec in enumerate(IMAGE_SPECS):
            ok = await download_image_from_unsplash(page, spec, i)
            if ok:
                success_count += 1
            await page.wait_for_timeout(1500)  # レート制限対策

        await browser.close()

    print(f"\n{'=' * 60}")
    print(f"Complete: {success_count}/{len(IMAGE_SPECS)} images")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    asyncio.run(main())
