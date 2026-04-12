"""
note記事投稿スクリプト

使い方:
  # 記事を投稿（ブラウザ表示、投稿ボタンは押さない）
  python run_note_post.py --folder "012_パステルポップ" --price 980

  # 画像を自動生成してから投稿（フルフロー）
  python run_note_post.py --folder "012_パステルポップ" --price 980 --generate-images

  # 画像生成のみ（投稿しない）
  python run_note_post.py --folder "012_パステルポップ" --generate-images --dry-run

  # 記事一覧
  python run_note_post.py --list

  # ドライラン（解析結果のみ表示、ブラウザ起動なし）
  python run_note_post.py --folder "012_パステルポップ" --dry-run
"""
import argparse
import logging
import sys
import io
from pathlib import Path

# Windows cp932 エンコーディング問題の回避
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from config import NOTE_EMAIL, NOTE_PASSWORD, NOTE_USERNAME
from actions.note_publisher import NotePublisher, parse_article, NOTE_DRAFTS_BASE
from actions.generate_images import generate_article_images


def setup_logging(verbose: bool = False):
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(ROOT / "note_post.log", encoding="utf-8"),
        ],
    )


def main():
    parser = argparse.ArgumentParser(description="note記事投稿")
    parser.add_argument("--folder", type=str, help="記事フォルダ名")
    parser.add_argument("--price", type=int, default=300, help="有料価格（円）。0で無料")
    parser.add_argument("--list", action="store_true", help="記事フォルダ一覧")
    parser.add_argument("--dry-run", action="store_true", help="解析結果のみ表示")
    parser.add_argument("--generate-images", action="store_true", help="投稿前に画像を自動生成（Gemini API）")
    parser.add_argument("--force-images", action="store_true", help="既存画像を上書きして再生成")
    parser.add_argument("--headless", action="store_true", help="ヘッドレスモード")
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
                has_thumb = "thumb" if (d / "thumbnail.png").exists() else "     "
                has_images = "img" if (d / "images").exists() or (d / "画像").exists() else "   "
                has_sns = "sns" if (d / "sns_posts.md").exists() or (d / "X投稿.md").exists() else "   "
                print(f"  [{has_thumb}] [{has_images}] [{has_sns}] {d.name}")
        return

    if not args.folder:
        parser.error("--folder は必須です（--list で一覧確認）")

    # フォルダ確認
    folder_path = NOTE_DRAFTS_BASE / args.folder
    if not folder_path.exists():
        logger.error(f"フォルダが見つかりません: {folder_path}")
        return

    # 画像自動生成（--generate-images 指定時）
    if args.generate_images:
        print(f"\n{'='*50}")
        print("画像自動生成（Gemini API）")
        print(f"{'='*50}")
        results = generate_article_images(str(folder_path), force=args.force_images)
        ok = sum(1 for r in results if r["status"] == "OK")
        skip = sum(1 for r in results if r["status"] == "SKIP")
        fail = sum(1 for r in results if r["status"] == "FAILED")
        for r in results:
            print(f"  [{r['status']}] {r['name']}: {r.get('path') or 'N/A'}")
        print(f"\n生成: {ok}  スキップ: {skip}  失敗: {fail}")
        if fail > 0:
            logger.warning(f"画像生成に{fail}件失敗しました。続行します。")
        print(f"{'='*50}\n")

    # 記事解析
    article = parse_article(str(folder_path))
    article["price"] = args.price

    # 解析結果表示
    print(f"\n{'='*50}")
    print(f"記事: {article['title']}")
    print(f"{'='*50}")
    print(f"  無料部分: {len(article['free_content'])}文字")
    print(f"  有料部分: {len(article['paid_content'])}文字")
    print(f"  セクション画像: {len(article['section_images'])}枚")
    for heading, path in article["section_images"].items():
        print(f"    - {heading[:30]} → {Path(path).name}")
    print(f"  サムネイル: {'あり' if article['thumbnail_path'] else 'なし'}")
    print(f"  ハッシュタグ: {article['hashtags']}")
    print(f"  価格: {article['price']}円")
    print(f"  Xプロモ文: {article['promo_text'][:50]}..." if article['promo_text'] else "  Xプロモ文: なし")
    print(f"{'='*50}")

    if args.dry_run:
        print("\n[ドライラン] ブラウザ起動なし。解析結果のみ。")
        return

    # 認証チェック
    if not NOTE_EMAIL or not NOTE_PASSWORD:
        logger.error(".envにNOTE_EMAIL/NOTE_PASSWORDが設定されていません")
        return

    # 投稿実行
    pub = NotePublisher(headless=args.headless)
    try:
        pub.start()
        pub.login(NOTE_EMAIL, NOTE_PASSWORD)
        pub.post_article(article)

        print("\n" + "=" * 50)
        print("ブラウザを確認してください。")
        print("  → OKなら「投稿」ボタンを手動でクリック")
        print("  → NGならブラウザを閉じてやり直し")
        print("=" * 50)
        try:
            input("\nEnter キーでブラウザを閉じます...")
        except EOFError:
            # 非対話環境（Claude Code等）ではEnter待ちをスキップ
            print("\n[非対話モード] ブラウザは開いたままです。手動で閉じてください。")
            import time as t
            t.sleep(600)  # 10分待機（その間にブラウザを確認）
    except Exception as e:
        logger.exception(f"投稿エラー: {e}")
    finally:
        pub.close()


if __name__ == "__main__":
    main()
