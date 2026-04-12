"""
自動投稿 — フォルダ監視→テキスト生成→各プラットフォームに投稿
Windowsタスクスケジューラ or 手動実行

使い方:
  python run_auto_post.py                       # 承認制（WebUIで確認後に投稿）
  python run_auto_post.py --auto-approve        # 即投稿
  python run_auto_post.py --platform ig         # Instagramのみ
  python run_auto_post.py --platform th         # Threadsのみ
  python run_auto_post.py --platform x          # Xのみ
  python run_auto_post.py --note-url URL        # note記事URLを投稿に含める
  python run_auto_post.py --dry-run             # テキスト生成のみ（投稿しない）
  python run_auto_post.py --images chibi.png ss1.png ss2.png  # カルーセル（自動順序判定）
"""
import argparse
import logging
import os
import sys
import json
from datetime import datetime

from config import (
    INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID,
    THREADS_ACCESS_TOKEN, THREADS_USER_ID,
    X_USERNAME, X_PASSWORD, X_COOKIES_PATH,
    IMAGES_TO_POST_DIR, POSTED_IMAGES_DIR,
)
from database import Database
from watcher.folder_watcher import FolderWatcher
from actions.auto_post import AutoPost

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("auto_post.log", encoding="utf-8"),
    ],
)
logger = logging.getLogger(__name__)


def build_platforms(target: str) -> dict:
    """対象プラットフォームのインスタンスを構築"""
    platforms = {}

    if target in ("ig", "ig_th", "all"):
        if INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID:
            from platforms.instagram import InstagramPlatform
            platforms["instagram"] = InstagramPlatform(
                INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
            )
        else:
            logger.warning("Instagram credentials not set, skipping")

    if target in ("th", "ig_th", "all"):
        if THREADS_ACCESS_TOKEN and THREADS_USER_ID:
            from platforms.threads import ThreadsPlatform
            platforms["threads"] = ThreadsPlatform(
                THREADS_ACCESS_TOKEN, THREADS_USER_ID
            )
        else:
            logger.warning("Threads credentials not set, skipping")

    if target in ("x", "all"):
        if X_USERNAME and X_PASSWORD:
            from platforms.x_twitter import XTwitterPlatform
            platforms["x"] = XTwitterPlatform(
                X_USERNAME, X_PASSWORD, X_COOKIES_PATH
            )
        else:
            logger.warning("X credentials not set, skipping")

    return platforms


def main():
    parser = argparse.ArgumentParser(description="自動投稿")
    parser.add_argument("--platform", choices=["ig", "th", "ig_th", "x", "all"], default="ig_th",
                        help="対象プラットフォーム（デフォルト: ig_th。Xは手動運用）")
    parser.add_argument("--auto-approve", action="store_true",
                        help="承認なしで即投稿")
    parser.add_argument("--note-url", default=None,
                        help="note記事URLを投稿に含める")
    parser.add_argument("--image", default=None,
                        help="画像パスを直接指定（単一画像）")
    parser.add_argument("--images", nargs="+", default=None,
                        help="複数画像パス（カルーセル投稿。自動で順番を判定）")
    parser.add_argument("--dry-run", action="store_true",
                        help="テキスト生成のみ（投稿しない）")
    args = parser.parse_args()

    db = Database()
    watcher = FolderWatcher(IMAGES_TO_POST_DIR, POSTED_IMAGES_DIR)

    # カルーセルモード（複数画像）
    if args.images:
        from pathlib import Path
        from ai.image_classifier import classify_images

        image_paths = []
        for p in args.images:
            pp = Path(p)
            if pp.exists():
                image_paths.append(str(pp))
            else:
                logger.warning(f"画像が見つかりません: {p}")

        if not image_paths:
            logger.error("有効な画像がありません")
            return

        # 画像を自動分類・順序決定
        gemini_key = os.environ.get("GEMINI_API_KEY")
        classified = classify_images(image_paths, gemini_key)
        ordered_paths = [c["path"] for c in classified]

        logger.info(f"=== カルーセル投稿: {len(ordered_paths)}枚 ===")
        for c in classified:
            logger.info(f"  [{c['type']}] {Path(c['path']).name}")

        platforms = build_platforms(args.platform)
        if not platforms:
            logger.error("有効なプラットフォームがありません")
            return

        poster = AutoPost(platforms)

        # テキスト生成（1枚目の画像ベースで）
        drafts = poster.create_draft(ordered_paths[0], note_url=args.note_url)

        if args.dry_run:
            for pn, txt in drafts.items():
                if txt:
                    logger.info(f"  [{pn}] {txt[:80]}...")
            logger.info("[dry-run] 投稿スキップ")
            return

        # IGカルーセル投稿
        if "instagram" in platforms and drafts.get("instagram"):
            from actions.auto_post import upload_image_to_github
            public_urls = []
            for p in ordered_paths:
                url = upload_image_to_github(p)
                if url:
                    public_urls.append(url)
                    import time; time.sleep(2)

            if len(public_urls) >= 2:
                ig = platforms["instagram"]
                result = ig.post_carousel(public_urls, drafts["instagram"])
                if result:
                    db.save_post(platform="instagram", post_id=str(result),
                                 text=drafts["instagram"], note_url=args.note_url)
                    logger.info(f"  [instagram] カルーセル投稿完了: {result}")

        # Threadsはテキスト投稿（画像1枚目のみ）
        if "threads" in platforms and drafts.get("threads"):
            result = poster.publish("threads", drafts["threads"], ordered_paths[0])
            if result:
                db.save_post(platform="threads", post_id=str(result),
                             text=drafts["threads"], note_url=args.note_url)
                logger.info(f"  [threads] 投稿完了: {result}")

        return

    # 単一画像モード: --image指定 or フォルダ監視
    if args.image:
        from pathlib import Path
        img = Path(args.image)
        if not img.exists():
            logger.error(f"画像が見つかりません: {args.image}")
            return
        new_images = [img]
    else:
        new_images = watcher.get_new_images()

    if not new_images:
        logger.info("投稿待ち画像なし")
        return

    logger.info(f"=== 自動投稿開始: {len(new_images)}枚の画像を検出 ===")

    # プラットフォーム構築
    platforms = build_platforms(args.platform)
    if not platforms:
        logger.error("有効なプラットフォームがありません")
        return

    poster = AutoPost(platforms)

    for image_path in new_images:
        logger.info(f"[処理中] {image_path.name}")

        # 1. 各プラットフォーム向けテキスト生成
        drafts = poster.create_draft(
            image_path=str(image_path),
            note_url=args.note_url,
        )

        if not any(drafts.values()):
            logger.warning(f"[スキップ] テキスト生成失敗: {image_path.name}")
            continue

        for platform_name, text in drafts.items():
            if text:
                logger.info(f"  [{platform_name}] 生成テキスト: {text[:80]}...")

        # 2. dry-runなら投稿せずスキップ
        if args.dry_run:
            logger.info(f"[dry-run] 投稿スキップ: {image_path.name}")
            continue

        # 3. 承認制 or 即投稿
        if args.auto_approve:
            # 即投稿
            results = poster.publish_all(drafts, image_path=str(image_path))
            for platform_name, post_result in results.items():
                if post_result:
                    db.save_post(
                        platform=platform_name,
                        post_id=str(post_result),
                        text=drafts.get(platform_name),
                        image_path=str(image_path),
                        note_url=args.note_url,
                    )
                    logger.info(f"  [{platform_name}] 投稿完了: {post_result}")
                else:
                    logger.error(f"  [{platform_name}] 投稿失敗")

            # 投稿済み画像をアーカイブ
            watcher.archive_image(image_path)
        else:
            # 承認待ちとしてDB保存
            for platform_name, text in drafts.items():
                if text:
                    db.save_pending_post(
                        platform=platform_name,
                        text=text,
                        image_path=str(image_path),
                        note_url=args.note_url,
                    )
            logger.info(f"  [承認待ち] WebUI(https://localhost:8081)で確認してください")

    # 集計
    logger.info(f"=== 完了: {len(new_images)}枚処理 ===")


if __name__ == "__main__":
    main()
