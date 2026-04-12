"""
ライター実行スクリプト — 品質スコア付き投稿バッチ生成
Usage:
    python run_writer.py --account shikumiya_ai --platform threads --batch 5
    python run_writer.py --account ando_lyo --platform x --theme "Claude Codeの使い方"
"""
import argparse
import json
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("writer.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="品質スコア付き投稿バッチ生成")
    parser.add_argument("--account", default="shikumiya_ai", help="アカウント名")
    parser.add_argument("--platform", default="threads", help="プラットフォーム（x/x_longform/threads/instagram）")
    parser.add_argument("--batch", type=int, default=5, help="生成本数")
    parser.add_argument("--theme", default=None, help="テーマ（指定なしなら自動選択）")
    parser.add_argument("--use-research", action="store_true", help="最新リサーチ結果を使う")
    parser.add_argument("--use-analysis", action="store_true", help="最新分析結果を使う")
    parser.add_argument("--auto-queue", action="store_true", help="合格した投稿をpending_postsに自動追加")
    args = parser.parse_args()

    from config import DB_PATH
    from actions.writer import generate_batch

    # リサーチ/分析データの読み込み
    research_data = None
    analysis_data = None

    if args.use_research:
        from actions.researcher import get_latest_research
        research_data = get_latest_research(args.account)
        if research_data:
            logger.info("Loaded latest research data")

    if args.use_analysis:
        from actions.analyst import get_latest_analysis
        analysis_data = get_latest_analysis(args.account)
        if analysis_data:
            logger.info("Loaded latest analysis data")

    accepted = generate_batch(
        account=args.account,
        platform=args.platform,
        batch_size=args.batch,
        theme=args.theme,
        research_data=research_data,
        analysis_data=analysis_data,
        db_path=DB_PATH,
    )

    logger.info(f"Generated {len(accepted)} posts (score >= 7.0)")

    # 合格した投稿をpending_postsに追加
    if args.auto_queue and accepted:
        from database import Database
        db = Database(DB_PATH)
        for draft in accepted:
            db.save_pending_post(
                platform=draft["platform"],
                text=draft["text"],
                account=args.account,
            )
            logger.info(f"Queued: [{args.account}] {draft['text'][:50]}... (score={draft['avg_score']})")
        logger.info(f"{len(accepted)} posts added to pending queue")

    # サマリー表示
    for i, draft in enumerate(accepted, 1):
        print(f"\n--- Draft {i} ---")
        print(f"Score: {draft['avg_score']} | Pattern: {draft.get('pattern')}")
        print(f"Text: {draft['text'][:100]}...")


if __name__ == "__main__":
    main()
