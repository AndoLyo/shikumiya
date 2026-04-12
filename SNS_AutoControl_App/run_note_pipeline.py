"""
note記事 → SNS告知パイプライン実行スクリプト

使い方:
  # フルパイプライン（X+IG+Threads + 初速ブースト）
  python run_note_pipeline.py --folder "007_テーマ1つで..." --url https://note.com/...

  # Xだけ
  python run_note_pipeline.py --folder "007_..." --url https://note.com/... --only x

  # ブーストなし
  python run_note_pipeline.py --folder "007_..." --url https://note.com/... --no-boost

  # テキスト生成のみ（投稿しない）
  python run_note_pipeline.py --folder "007_..." --url https://note.com/... --dry-run

  # 記事一覧
  python run_note_pipeline.py --list
"""
import argparse
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from database import Database
from actions.note_pipeline import NotePipeline, NOTE_DRAFTS_BASE


def setup_logging(verbose: bool = False):
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(ROOT / "note_pipeline.log", encoding="utf-8"),
        ],
    )


def main():
    parser = argparse.ArgumentParser(description="note → SNS告知パイプライン")
    parser.add_argument("--folder", type=str, help="記事フォルダ名")
    parser.add_argument("--url", type=str, help="note公開後のURL")
    parser.add_argument("--account", default="ando_lyo", help="投稿アカウント")
    parser.add_argument("--only", type=str, help="投稿先限定（カンマ区切り: x,ig,threads）")
    parser.add_argument("--no-boost", action="store_true", help="初速ブーストなし")
    parser.add_argument("--dry-run", action="store_true", help="テキスト生成のみ（投稿しない）")
    parser.add_argument("--list", action="store_true", help="記事フォルダ一覧")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    setup_logging(args.verbose)
    logger = logging.getLogger(__name__)

    # 記事一覧
    if args.list:
        print(f"\n=== 記事フォルダ一覧 ({NOTE_DRAFTS_BASE}) ===")
        for d in sorted(NOTE_DRAFTS_BASE.iterdir()):
            has_article = (d / "article.md").exists() or (d / "記事.md").exists()
            if d.is_dir() and has_article:
                has_thumb = (d / "thumbnail.png").exists()
                has_images = (d / "images").exists() or (d / "画像").exists()
                print(f"  {d.name}  {'[thumb]' if has_thumb else ''} {'[images]' if has_images else ''}")
        return

    if not args.folder or not args.url:
        parser.error("--folder と --url は必須です（--list で一覧確認）")

    db = Database()
    pipeline = NotePipeline(db, account=args.account)

    # プラットフォーム選択
    platforms = ["x", "ig", "threads"]
    if args.only:
        platforms = [p.strip() for p in args.only.split(",")]

    if args.dry_run:
        # テキスト生成のみ
        article = pipeline.load_article(args.folder)
        if not article:
            print("記事読み込み失敗")
            return

        print(f"\n=== 記事: {article['title']} ===\n")
        texts = pipeline.generate_sns_texts(article["title"], article["content"], args.url)

        for platform, text in texts.items():
            print(f"\n--- {platform} ---")
            print(text or "(生成失敗)")
        return

    # フルパイプライン
    result = pipeline.run_pipeline(
        folder_name=args.folder,
        note_url=args.url,
        platforms=platforms,
        boost=not args.no_boost,
    )

    print(f"\n=== 結果 ===")
    print(f"  記事: {result.get('article', {}).get('title', '?')}")
    for platform, status in result.get("posts", {}).items():
        print(f"  {platform}: {status}")
    if result.get("boost"):
        b = result["boost"]
        print(f"  ブースト: いいね={'OK' if b.get('liked') else 'NG'} リプ={'OK' if b.get('replied') else 'NG'}")


if __name__ == "__main__":
    main()
