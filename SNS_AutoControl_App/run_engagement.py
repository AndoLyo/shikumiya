"""
エンゲージメント自動実行スクリプト（X特化）

使い方:
  # フルサイクル（発見→いいね→リプライ→フォロー→引用RT）
  python run_engagement.py --account shikumiya_ai

  # キーワード指定
  python run_engagement.py --account shikumiya_ai --keywords "AIアート" "プロンプト" "ポートフォリオ"

  # アクション限定
  python run_engagement.py --account shikumiya_ai --only like,reply

  # ターゲット手動追加
  python run_engagement.py --account shikumiya_ai --add-targets @user1 @user2

  # ドライラン（ブラウザ操作なし、ターゲット発見のみ）
  python run_engagement.py --account shikumiya_ai --dry-run

  # 日次統計表示
  python run_engagement.py --account shikumiya_ai --stats

  # 初速ブースト（投稿直後にもう1アカウントからいいね+リプ）
  python run_engagement.py --account shikumiya_ai --boost https://x.com/shikumiya_ai/status/123456

  # スマートアンフォロー（非アクティブ・スパム垢を整理）
  python run_engagement.py --account shikumiya_ai --unfollow --max-unfollows 50

  # エバーグリーンリサイクル（過去バズ投稿をリライト再投稿）
  python run_engagement.py --account shikumiya_ai --recycle --min-likes 10
"""
import argparse
import logging
import sys
from pathlib import Path

# プロジェクトルート
ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from config import get_x_account, get_account_dir, X_COOKIES_PATH
from database import Database
from platforms.x_twitter import XTwitterPlatform
from actions.engagement import XEngagement

# デフォルトキーワード（アカウント別）
# NOTE: shikumiya_ai は封印中（2026-04時点）。定義は残すがフォールバック用
DEFAULT_KEYWORDS = {
    "shikumiya_ai": [
        "AIイラスト",
        "AIアート",
        "AI画像生成",
        "AI サイト",
        "#AIart",
    ],
    "ando_lyo": [
        "AIイラスト",
        "AIアート",
        "AI画像生成",
        "AI サイト",
        "#AIart",
    ],
    # 現在のメインアカウント
    "ando_lyo_ai": [
        "AIイラスト",
        "AIアート",
        "AI画像生成",
        "AI サイト",
        "#AIart",
    ],
}

# アカウント別のデフォルトアクション
ACCOUNT_DEFAULT_ACTIONS = {
    # shikumiya_ai: 封印中（2026-04時点）
    "shikumiya_ai": {"reply": True, "follow": True, "quote_rt": True},
    # ando_lyo: 旧アカウント名（互換用）
    "ando_lyo": {"reply": True, "follow": True, "quote_rt": True},
    # ando_lyo_ai: 現在のメインアカウント
    "ando_lyo_ai": {"reply": True, "follow": True, "quote_rt": True},
}


def setup_logging(verbose: bool = False):
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(ROOT / "engagement.log", encoding="utf-8"),
        ],
    )


def generate_analytics_report(account: str, db: Database, result: dict, scores: dict):
    """実行結果を分析して改善レポートを生成・保存"""
    import json
    from datetime import datetime

    logger = logging.getLogger(__name__)
    account_dir = get_account_dir(account)
    if not account_dir:
        return

    report_path = Path(account_dir) / "engagement_report.md"
    kw_path = Path(account_dir) / "keyword_quality.json"

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    avg_quality = scores.get("action_avg_quality", 0) if scores else 0
    target_avg = scores.get("target_avg_relevance", 0) if scores else 0

    lines = [
        f"# エンゲージメント分析レポート — @{account}",
        f"> 生成: {now}",
        "",
        "## 今回の実績",
        f"- 発見: {result.get('discovered', 0)}件",
        f"- いいね: {result.get('liked', 0)}件",
        f"- リプライ: {result.get('replied', 0)}件",
        f"- フォロー: {result.get('followed', 0)}件",
        f"- 引用RT: {result.get('quoted', 0)}件",
        "",
        "## スコア",
        f"- ターゲット適合: 平均 {target_avg}点",
        f"- アクション品質: 平均 {avg_quality}点",
        "",
    ]

    # キーワード品質分析
    if kw_path.exists():
        try:
            kw_data = json.loads(kw_path.read_text(encoding="utf-8"))
            today = datetime.now().strftime("%Y-%m-%d")
            today_stats = kw_data.get(today, {})
            if today_stats:
                lines.append("## キーワード品質")
                lines.append("| キーワード | 検索数 | 適合数 | 適合率 | 平均スコア | 判定 |")
                lines.append("|---|---|---|---|---|---|")
                good_kws = []
                bad_kws = []
                for kw, stat in sorted(today_stats.items(),
                                        key=lambda x: x[1].get("hit_rate", 0), reverse=True):
                    hr = stat.get("hit_rate", 0)
                    quality = "◎" if hr >= 50 else "○" if hr >= 25 else "△" if hr > 0 else "✗"
                    lines.append(
                        f"| {kw} | {stat.get('searched', 0)} | {stat.get('matched', 0)} "
                        f"| {hr}% | {stat.get('avg_score', 0)} | {quality} |"
                    )
                    if hr >= 30:
                        good_kws.append(kw)
                    elif stat.get("searched", 0) >= 3 and hr < 10:
                        bad_kws.append(kw)

                lines.append("")
                if bad_kws:
                    lines.append("### 改善が必要なキーワード")
                    for kw in bad_kws:
                        lines.append(f"- **「{kw}」** → 適合率が低い。別のワードに切り替え推奨")
                    lines.append("")
                if good_kws:
                    lines.append("### 高品質キーワード")
                    for kw in good_kws:
                        lines.append(f"- **「{kw}」** → 継続使用")
                    lines.append("")
        except Exception as e:
            logger.warning(f"キーワード品質読み込みエラー: {e}")

    # 改善提案
    lines.append("## 改善提案")
    if avg_quality < 30:
        lines.append("- ⚠ アクション品質が低い。ターゲットがズレている可能性大")
        lines.append("- キーワードをより具体的な悩みベースに変更する")
        lines.append("- bio_keywordsのhigh/mediumの見直しが必要")
    elif avg_quality < 50:
        lines.append("- △ 品質は中程度。キーワードの精度を上げる余地あり")
        lines.append("- 適合率の高いキーワードに集中する")
    else:
        lines.append("- ◎ 品質良好。このキーワード群を維持")

    if target_avg < 30:
        lines.append("- ターゲット適合度が低い。検索ワードがノイズを拾っている")
    if result.get("discovered", 0) == 0:
        lines.append("- ターゲットが見つからなかった。キーワードの見直しが必要")

    lines.append("")
    lines.append("---")
    lines.append(f"*次回実行時にこのレポートを参照して改善を適用*")

    report_path.write_text("\n".join(lines), encoding="utf-8")
    logger.info(f"[分析レポート] {report_path}")
    print(f"\n📊 分析レポート保存: {report_path}")


def _kill_existing_drivers():
    """既存のchromedriverプロセスを全て終了（二重起動防止）
    起動前に1回だけ呼ぶ。実行中は呼ばない。"""
    import subprocess
    try:
        # まずchromedriverが存在するか確認
        check = subprocess.run(
            ["tasklist", "/FI", "IMAGENAME eq undetected_chromedriver.exe"],
            capture_output=True, text=True, timeout=5,
        )
        if "undetected_chromedriver" in check.stdout:
            subprocess.run(
                ["taskkill", "/F", "/IM", "undetected_chromedriver.exe"],
                capture_output=True, timeout=5,
            )
            logging.getLogger(__name__).info("[クリーンアップ] 既存のchromedriverを終了しました")
            import time
            time.sleep(3)
    except Exception:
        pass


def main():
    parser = argparse.ArgumentParser(description="X エンゲージメント自動化")
    parser.add_argument("--account", default="shikumiya_ai", help="アカウント名")
    parser.add_argument("--keywords", nargs="*", help="検索キーワード（未指定時はデフォルト使用）")
    parser.add_argument("--only", type=str, help="実行アクション（カンマ区切り: like,reply,follow,quote_rt）")
    parser.add_argument("--add-targets", nargs="*", help="ターゲット手動追加（@username）")
    parser.add_argument("--max-likes", type=int, default=10)
    parser.add_argument("--max-replies", type=int, default=5)
    parser.add_argument("--max-follows", type=int, default=10)
    parser.add_argument("--max-quotes", type=int, default=3)
    parser.add_argument("--no-discover", action="store_true", help="ターゲット発見をスキップ")
    parser.add_argument("--dry-run", action="store_true", help="発見のみ（アクション実行なし）")
    parser.add_argument("--stats", action="store_true", help="日次統計のみ表示")
    parser.add_argument("--boost", type=str, help="投稿URLを指定して初速ブースト（もう1アカウントからいいね+リプ）")
    parser.add_argument("--unfollow", action="store_true", help="スマートアンフォロー実行")
    parser.add_argument("--max-unfollows", type=int, default=30)
    parser.add_argument("--recycle", action="store_true", help="エバーグリーンリサイクル（過去バズ投稿をリライト再投稿）")
    parser.add_argument("--max-recycles", type=int, default=3)
    parser.add_argument("--min-likes", type=int, default=5, help="リサイクル対象の最低いいね数")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    setup_logging(args.verbose)
    logger = logging.getLogger(__name__)

    # 既存のchromedriverを殺してから起動（二重起動防止）
    if not args.stats:
        _kill_existing_drivers()

    db = Database()

    # 統計のみ
    if args.stats:
        stats = db.get_daily_stats("x", args.account)
        targets = db.get_engagement_targets("x", args.account)
        scores = db.get_daily_score_summary("x", args.account)
        print(f"\n=== {args.account} 日次統計 ===")
        print(f"  いいね:  {stats.get('likes', 0)}")
        print(f"  リプライ: {stats.get('replies', 0)}")
        print(f"  フォロー: {stats.get('follows', 0)}")
        print(f"  引用RT:  {stats.get('quote_rts', 0)}")
        print(f"  リツイート: {stats.get('retweets', 0)}")
        print(f"\n  登録ターゲット: {len(targets)}件")
        for tier in ["large", "medium", "small"]:
            count = len([t for t in targets if t.get("tier") == tier])
            print(f"    {tier}: {count}件")
        print(f"\n=== スコア ===")
        print(f"  ターゲット適合: 平均 {scores.get('target_avg_relevance', 0)}点")
        print(f"    高適合(60+): {scores.get('target_high', 0)}件 / 低適合(20-39): {scores.get('target_low', 0)}件")
        print(f"  アクション品質: 平均 {scores.get('action_avg_quality', 0)}点")
        for atype, info in scores.get("action_scores_by_type", {}).items():
            print(f"    {atype}: 平均 {info['avg']}点 ({info['count']}件)")
        return

    # Xプラットフォーム初期化
    x_creds = get_x_account(args.account)
    cookies_path = str(ROOT / f"x_cookies_{args.account}.json")
    x = XTwitterPlatform(
        username=x_creds["username"],
        password=x_creds["password"],
        cookies_path=cookies_path,
        headless=False,
    )

    account_dir = get_account_dir(args.account)
    engagement = XEngagement(x, db, account=args.account, account_dir=account_dir)

    try:
        # ターゲット手動追加
        if args.add_targets:
            added = engagement.add_targets_manual(args.add_targets)
            logger.info(f"手動追加完了: {added}件")
            return

        # 初速ブースト
        if args.boost:
            other_account = "ando_lyo" if args.account == "shikumiya_ai" else "shikumiya_ai"
            other_creds = get_x_account(other_account)
            other_cookies = str(ROOT / f"x_cookies_{other_account}.json")
            boost_x = XTwitterPlatform(
                username=other_creds["username"],
                password=other_creds["password"],
                cookies_path=other_cookies,
            )
            try:
                result = engagement.boost_own_post(args.boost, boost_x)
                print(f"\n=== 初速ブースト結果 ===")
                print(f"  ブースト元: @{other_creds['username']}")
                print(f"  いいね: {'成功' if result['liked'] else '失敗'}")
                print(f"  リプライ: {'成功' if result['replied'] else '失敗'}")
                if result['reply_text']:
                    print(f"  リプライ文: {result['reply_text']}")
            finally:
                boost_x.close()
            return

        # スマートアンフォロー
        if args.unfollow:
            count = engagement.smart_unfollow(max_unfollows=args.max_unfollows)
            print(f"\nアンフォロー完了: {count}件")
            return

        # エバーグリーンリサイクル
        if args.recycle:
            count = engagement.recycle_top_posts(
                min_likes=args.min_likes, max_recycles=args.max_recycles,
            )
            print(f"\nリサイクル完了: {count}件")
            return

        # キーワード
        keywords = args.keywords or DEFAULT_KEYWORDS.get(args.account, DEFAULT_KEYWORDS["shikumiya_ai"])

        # アクション選択（アカウント別デフォルトを適用）
        actions = ACCOUNT_DEFAULT_ACTIONS.get(
            args.account, {"like": True, "reply": True, "follow": True, "quote_rt": True}
        ).copy()
        if args.only:
            actions = {k: False for k in actions}
            for a in args.only.split(","):
                a = a.strip()
                if a in actions:
                    actions[a] = True

        if args.dry_run:
            actions = {k: False for k in actions}

        # 1アクション1起動方式: 選択されたアクションを1つずつ実行
        # discoverだけは常に最初に（--no-discoverでスキップ可能）
        result = {"discovered": 0, "liked": 0, "replied": 0, "followed": 0, "quoted": 0}

        if not args.no_discover:
            logger.info("=== discover ===")
            targets = engagement.discover_targets(keywords, limit_per_keyword=5)
            result["discovered"] = len(targets)
            logger.info(f"発見完了: {len(targets)}件")

        # DBから全ターゲット取得
        all_targets = db.get_engagement_targets("x", args.account)

        # 選択されたアクションだけ実行（1つずつ）
        # いいねは廃止（アルゴリズム上最弱シグナル1x。リプライ75-150xに集中）
        if actions.get("follow"):
            logger.info("=== follow ===")
            result["followed"] = engagement.auto_follow(
                targets=all_targets, max_follows=args.max_follows,
            )
        if actions.get("reply"):
            logger.info("=== reply ===")
            result["replied"] = engagement.auto_reply(
                keywords=keywords, targets=all_targets, max_replies=args.max_replies,
            )
        if actions.get("quote_rt"):
            logger.info("=== quote_rt ===")
            result["quoted"] = engagement.auto_quote_rt(
                keywords=keywords, targets=all_targets, max_quotes=args.max_quotes,
            )

        print(f"\n=== 結果 ({args.account}) ===")
        print(f"  発見:    {result['discovered']}件")
        print(f"  いいね:  {result['liked']}件")
        print(f"  リプライ: {result['replied']}件")
        print(f"  フォロー: {result['followed']}件")
        print(f"  引用RT:  {result['quoted']}件")

        # スコアサマリー
        scores = result.get("scores", {})
        if scores:
            print(f"\n=== スコア ({args.account}) ===")
            print(f"  ターゲット適合: 平均 {scores.get('target_avg_relevance', 0)}点")
            print(f"    高適合(60+): {scores.get('target_high', 0)}件 / 低適合(20-39): {scores.get('target_low', 0)}件")
            print(f"  アクション品質: 平均 {scores.get('action_avg_quality', 0)}点")
            for atype, info in scores.get("action_scores_by_type", {}).items():
                print(f"    {atype}: 平均 {info['avg']}点 ({info['count']}件)")

            # 総合評価
            avg = scores.get("action_avg_quality", 0)
            if avg >= 60:
                grade = "A（良好） 届けたい人に届いてる"
            elif avg >= 40:
                grade = "B（改善余地あり） キーワードかターゲット設定を見直す"
            else:
                grade = "C（要改善） ターゲットがズレてる可能性大"
            print(f"\n  総合評価: {grade}")

        # === アナリティクス分析レポート ===
        generate_analytics_report(args.account, db, result, scores)

    finally:
        x.close()


if __name__ == "__main__":
    main()
