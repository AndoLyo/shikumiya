"""
LUMIÈRE - 日本人モデル画像の一括取得
Unsplash から japanese をキーワードに含めて検索し、
美容サロンに適した画像を全13枚ダウンロードする。
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "lumiere"

# 全13枚：日本人 or アジア人をキーワードに含める
SPECS = [
    {"name": "hero",         "query": "japanese-salon-interior-minimal-white",       "pick": 3},
    {"name": "mirror",       "query": "japanese-hair-salon-mirror",                  "pick": 4},
    {"name": "style-1",      "query": "japanese-woman-hair-back-view",               "pick": 3},
    {"name": "style-2",      "query": "asian-woman-bob-haircut-side",                "pick": 5},
    {"name": "style-3",      "query": "japanese-woman-long-hair-back",               "pick": 4},
    {"name": "style-4",      "query": "asian-woman-short-hair-portrait",             "pick": 6},
    {"name": "style-5",      "query": "japanese-woman-hair-color-natural",           "pick": 5},
    {"name": "style-6",      "query": "asian-woman-hair-updo-back",                  "pick": 3},
    {"name": "stylist",      "query": "japanese-hairdresser-woman-cutting-hair",     "pick": 3},
    {"name": "staff-hands-1","query": "hair-stylist-hands-cutting-asian",            "pick": 4},
    {"name": "staff-hands-2","query": "japanese-barista-coffee-hands",               "pick": 5},
    {"name": "menu-bg",      "query": "salon-towel-comb-minimal-white",             "pick": 4},
    {"name": "cta-bg",       "query": "japanese-cafe-window-evening-light",          "pick": 5},
]


async def download_from_unsplash(page, name: str, query: str, pick: int) -> bool:
    """Unsplash検索結果からpick番目の画像をダウンロード"""
    out = OUTPUT_DIR / f"{name}.jpg"
    if out.exists():
        print(f"  [SKIP] {name}.jpg")
        return True

    url = f"https://unsplash.com/s/photos/{query}"
    print(f"\n  [{name}] {url}")
    await page.goto(url, wait_until="networkidle", timeout=30000)
    await page.wait_for_timeout(5000)

    imgs = await page.query_selector_all("figure img[srcset]")
    print(f"    Found {len(imgs)} images")

    # Try multiple picks in case some fail
    for try_pick in range(pick, min(pick + 8, len(imgs))):
        img = imgs[try_pick]
        srcset = await img.get_attribute("srcset") or ""
        for part in reversed(srcset.split(",")):
            u = part.strip().split(" ")[0]
            if "images.unsplash.com/photo-" in u:
                base = u.split("?")[0]
                dl = f"{base}?w=1280&q=80&fit=crop&auto=format"
                try:
                    resp = await page.request.get(dl)
                    if resp.ok:
                        content = await resp.body()
                        if len(content) > 30000:
                            out.write_bytes(content)
                            print(f"    [OK] {name}.jpg ({len(content)//1024}KB) pick={try_pick}")
                            return True
                except:
                    continue

    print(f"    [FAIL] {name}")
    return False


async def main():
    print("=" * 60)
    print("LUMIERE - Japanese Image Fetcher")
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 60)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        ctx = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await ctx.new_page()

        ok = 0
        for spec in SPECS:
            if await download_from_unsplash(page, spec["name"], spec["query"], spec["pick"]):
                ok += 1
            await page.wait_for_timeout(1500)

        await browser.close()

    print(f"\n{'=' * 60}")
    print(f"Complete: {ok}/{len(SPECS)} images")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    asyncio.run(main())
