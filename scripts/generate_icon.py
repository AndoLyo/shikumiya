"""
Nano Banana 2（Gemini 3.1 Flash Image）でアイコンを生成するスクリプト

使い方:
  python scripts/generate_icon.py --concept "a calendar with clock" --output public/icons/booking.png
  python scripts/generate_icon.py --batch  # 全40機能分を一括生成

前提:
  pip install google-genai
  環境変数 GOOGLE_API_KEY を設定
"""

import argparse
import sys
from pathlib import Path

try:
    import google.genai as genai
except ImportError:
    print("ERROR: google-genai not installed")
    print("  pip install google-genai")
    sys.exit(1)


PLAN_COLORS = {
    "lite": ("#e84393", "pink"),
    "middle": ("#6c5ce7", "purple"),
    "premium": ("#f39c12", "orange"),
    "all": ("#6c5ce7", "purple"),
}

# 40機能のアイコン定義: (id, concept, plan)
ICON_DEFINITIONS = [
    # セクション系
    # セクション系
    ("hero-section", "a website hero banner with a large photo background and two call-to-action buttons", "lite"),
    ("news-section", "a news feed list showing dates and article titles with category tags", "middle"),
    ("works-gallery", "a photo portfolio grid with a category filter bar on top", "lite"),
    ("service-section", "four service cards arranged in a grid, each with an icon and title", "lite"),
    ("product-lineup", "a horizontal row of product cards that can be scrolled sideways", "middle"),
    ("technology-section", "statistics display showing large numbers with labels, like 500+ projects", "middle"),
    ("pickup-section", "a featured campaign banner with NEW badge and event date", "middle"),
    ("testimonials", "a customer review card with star rating, photo, and quote marks", "middle"),
    ("location-search", "a map with location pins and a region search dropdown", "premium"),
    ("company-info", "a company profile table showing corporate details like founding year", "lite"),
    ("cta-section", "a call-to-action bar with phone and email buttons", "lite"),
    ("video-section", "a video player with a large circular play button overlay", "premium"),
    ("recruit-page", "a job listing page with position titles and an apply button", "premium"),
    ("blog-section", "blog article cards with thumbnail images, titles, and dates", "middle"),
    ("faq-section", "an accordion FAQ list with question marks and expandable answers", "lite"),
    ("before-after", "a split-view image comparison with a draggable slider handle", "middle"),
    # 共通パーツ系
    ("header-nav", "a website header with logo on left and navigation menu items", "lite"),
    ("footer", "a website footer with columns of links, social icons, and copyright", "lite"),
    ("contact-form", "a contact form with input fields, radio buttons, and submit button", "lite"),
    ("breadcrumbs", "a breadcrumb navigation path showing Home > Category > Current page", "middle"),
    ("google-maps", "a Google Maps embed with a red location pin marker", "middle"),
    ("sns-integration", "social media icons for Instagram, X Twitter, YouTube, and LINE", "lite"),
    ("cookie-consent", "a cookie consent banner at the bottom with Accept and Decline buttons", "middle"),
    ("site-search", "a search bar with magnifying glass and autocomplete dropdown suggestions", "premium"),
    # 機能系
    ("ai-chatbot", "a chat widget bubble in bottom-right corner with AI assistant messages", "premium"),
    ("booking-system", "a calendar date picker with available time slots and remaining seats", "premium"),
    ("multilingual", "a language switcher showing JA/EN flags with translated text below", "premium"),
    ("panorama-viewer", "a 360-degree panoramic view of a room interior with rotation arrows", "premium"),
    ("pdf-download", "a PDF document icon with a download arrow button", "premium"),
    ("image-gallery", "a masonry photo gallery grid with a lightbox zoom icon", "lite"),
    ("file-upload", "a drag-and-drop upload zone with a dashed border and upload arrow", "premium"),
    ("review-rating", "star rating display showing 4.8 out of 5 with review count", "middle"),
    ("notification", "notification icons for email, LINE message, and Slack with checkmarks", "middle"),
    ("analytics-dashboard", "a dashboard with bar chart, line graph, and KPI number cards", "premium"),
    ("dark-mode", "a toggle switch between sun and moon icons for light/dark mode", "middle"),
    ("animation", "a scroll animation effect showing elements fading in while scrolling down", "lite"),
    # 横断系
    ("seo-check", "a Google search results page showing a website listing with rich snippet", "all"),
    ("responsive-check", "three devices side by side: smartphone, tablet, and laptop showing same site", "all"),
    ("accessibility-check", "accessibility symbols: screen reader, keyboard, and high contrast icons", "all"),
    ("performance-check", "a speed gauge meter showing green score with LCP and CLS labels", "all"),
]


def generate_icon(concept: str, output_path: str, style: str = "flat", color: str = "#6c5ce7", color_name: str = "purple") -> bool:
    """1つのアイコンを生成"""
    from google.genai import types

    client = genai.Client()

    prompt = f"""A single LARGE icon representing "{concept}".
Soft 3D clay-like shape with a frosted glass overlay effect.
The icon has puffy rounded depth like molded clay, but with a subtle glass sheen and soft inner glow.
Combine the warmth of clay texture with the premium feel of glassmorphism.
{color_name} color ({color}) with lighter {color_name} glass highlights.
The icon must fill exactly 85% of the canvas. Square 1:1.
White background. ONE object only. No text."""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-image-preview",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
            ),
        )

        for part in response.candidates[0].content.parts:
            if hasattr(part, "inline_data") and part.inline_data:
                Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                Path(output_path).write_bytes(part.inline_data.data)
                return True

    except Exception as e:
        print(f"  error: {e}")

    return False


def main():
    parser = argparse.ArgumentParser(description="Nano Banana 2 アイコン生成")
    parser.add_argument("--concept", help="アイコンの概念（英語）")
    parser.add_argument("--output", help="出力パス")
    parser.add_argument("--style", default="flat", help="スタイル (flat/3d/line)")
    parser.add_argument("--batch", action="store_true", help="全40機能分を一括生成")
    parser.add_argument("--output-dir", default="public/icons", help="一括生成時の出力ディレクトリ")
    args = parser.parse_args()

    if args.batch:
        print(f"📸 全{len(ICON_DEFINITIONS)}個のアイコンを生成します...")
        success = 0
        fail = 0

        for icon_id, concept, plan in ICON_DEFINITIONS:
            output = f"{args.output_dir}/{icon_id}.png"

            # 既に存在する場合はスキップ
            if Path(output).exists():
                print(f"  ⏭️ {icon_id}: 既に存在、スキップ")
                success += 1
                continue

            hex_color, color_name = PLAN_COLORS.get(plan, ("#6c5ce7", "purple"))
            ok = generate_icon(concept, output, args.style, color=hex_color, color_name=color_name)
            if ok:
                print(f"  ✅ {icon_id}")
                success += 1
            else:
                print(f"  ❌ {icon_id}")
                fail += 1

        print(f"\n📸 完了: {success}成功 / {fail}失敗")

    elif args.concept and args.output:
        ok = generate_icon(args.concept, args.output, args.style)
        if ok:
            print(f"✅ 保存: {args.output}")
        else:
            print("FAIL: generation failed")
            sys.exit(1)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
