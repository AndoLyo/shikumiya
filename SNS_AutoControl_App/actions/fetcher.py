"""
フェッチャーエージェント — 投稿メトリクス自動取得
既存の platforms/ API を使って投稿のパフォーマンスデータを収集する
"""
import json
import logging
import os
import sqlite3
from datetime import datetime

logger = logging.getLogger(__name__)

# プロジェクトルート
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))


def init_metrics_table(db_path: str):
    """メトリクステーブルを作成（既存テーブルには触らない）"""
    with sqlite3.connect(db_path) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS post_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id TEXT NOT NULL,
                platform TEXT NOT NULL,
                account TEXT,
                checkpoint TEXT NOT NULL,
                views INTEGER DEFAULT 0,
                likes INTEGER DEFAULT 0,
                replies INTEGER DEFAULT 0,
                saves INTEGER DEFAULT 0,
                shares INTEGER DEFAULT 0,
                raw_data TEXT,
                fetched_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(post_id, checkpoint)
            )
        """)


def fetch_instagram_metrics(ig_platform, post_id: str) -> dict:
    """Instagram投稿のメトリクスを取得"""
    try:
        data = ig_platform._request(
            "GET",
            post_id,
            params={"fields": "id,like_count,comments_count,timestamp,permalink"},
        )
        return {
            "views": 0,  # IG基本APIではimpression取れない場合がある
            "likes": data.get("like_count", 0),
            "replies": data.get("comments_count", 0),
            "saves": 0,
            "shares": 0,
            "raw": data,
        }
    except Exception as e:
        logger.error(f"IG metrics fetch failed for {post_id}: {e}")
        return None


def fetch_threads_metrics(th_platform, post_id: str) -> dict:
    """Threads投稿のメトリクスを取得"""
    try:
        data = th_platform._request(
            "GET",
            post_id,
            params={"fields": "id,text,timestamp,permalink"},
        )
        # Threads Insights API（投稿単位）
        try:
            insights = th_platform._request(
                "GET",
                f"{post_id}/insights",
                params={"metric": "views,likes,replies"},
            )
            metrics = {}
            for item in insights.get("data", []):
                name = item.get("name", "")
                values = item.get("values", [{}])
                metrics[name] = values[0].get("value", 0) if values else 0
        except Exception:
            metrics = {}

        return {
            "views": metrics.get("views", 0),
            "likes": metrics.get("likes", 0),
            "replies": metrics.get("replies", 0),
            "saves": 0,
            "shares": 0,
            "raw": data,
        }
    except Exception as e:
        logger.error(f"Threads metrics fetch failed for {post_id}: {e}")
        return None


def save_metrics(db_path: str, post_id: str, platform: str, account: str,
                 checkpoint: str, metrics: dict):
    """メトリクスをDBに保存"""
    init_metrics_table(db_path)
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            """INSERT OR REPLACE INTO post_metrics
               (post_id, platform, account, checkpoint, views, likes, replies, saves, shares, raw_data)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                post_id, platform, account, checkpoint,
                metrics.get("views", 0),
                metrics.get("likes", 0),
                metrics.get("replies", 0),
                metrics.get("saves", 0),
                metrics.get("shares", 0),
                json.dumps(metrics.get("raw", {}), ensure_ascii=False),
            ),
        )
    logger.info(f"Saved metrics: {platform}/{post_id} @ {checkpoint}")


def determine_checkpoint(posted_at_str: str) -> str | None:
    """投稿時刻から適切なチェックポイントを判定する

    Returns:
        "1h" / "6h" / "24h" / None（計測不要）
    """
    try:
        posted_at = datetime.fromisoformat(posted_at_str.replace("Z", "+00:00"))
        now = datetime.now(posted_at.tzinfo) if posted_at.tzinfo else datetime.now()
        hours = (now - posted_at).total_seconds() / 3600

        if 0.5 <= hours < 2:
            return "1h"
        elif 4 <= hours < 8:
            return "6h"
        elif 20 <= hours < 30:
            return "24h"
        return None
    except Exception:
        return None


def fetch_all_recent(db_path: str, ig_platform=None, th_platform=None,
                     account: str = None, limit: int = 10):
    """直近の投稿のメトリクスを一括取得

    Args:
        db_path: DBパス
        ig_platform: InstagramPlatformインスタンス
        th_platform: ThreadsPlatformインスタンス
        account: アカウント名
        limit: 取得する投稿数
    """
    init_metrics_table(db_path)
    results = {"fetched": 0, "skipped": 0, "errors": 0}

    # Instagram
    if ig_platform:
        try:
            posts = ig_platform.get_my_posts(limit=limit)
            for post in posts:
                post_id = post.get("id")
                timestamp = post.get("timestamp", "")
                checkpoint = determine_checkpoint(timestamp)
                if not checkpoint:
                    results["skipped"] += 1
                    continue

                # 既に取得済みかチェック
                with sqlite3.connect(db_path) as conn:
                    exists = conn.execute(
                        "SELECT 1 FROM post_metrics WHERE post_id = ? AND checkpoint = ?",
                        (post_id, checkpoint),
                    ).fetchone()
                if exists:
                    results["skipped"] += 1
                    continue

                metrics = fetch_instagram_metrics(ig_platform, post_id)
                if metrics:
                    save_metrics(db_path, post_id, "instagram", account, checkpoint, metrics)
                    results["fetched"] += 1
                else:
                    results["errors"] += 1
        except Exception as e:
            logger.error(f"IG fetch_all failed: {e}")

    # Threads
    if th_platform:
        try:
            posts = th_platform.get_my_posts(limit=limit)
            for post in posts:
                post_id = post.get("id")
                timestamp = post.get("timestamp", "")
                checkpoint = determine_checkpoint(timestamp)
                if not checkpoint:
                    results["skipped"] += 1
                    continue

                with sqlite3.connect(db_path) as conn:
                    exists = conn.execute(
                        "SELECT 1 FROM post_metrics WHERE post_id = ? AND checkpoint = ?",
                        (post_id, checkpoint),
                    ).fetchone()
                if exists:
                    results["skipped"] += 1
                    continue

                metrics = fetch_threads_metrics(th_platform, post_id)
                if metrics:
                    save_metrics(db_path, post_id, "threads", account, checkpoint, metrics)
                    results["fetched"] += 1
                else:
                    results["errors"] += 1
        except Exception as e:
            logger.error(f"Threads fetch_all failed: {e}")

    logger.info(f"Fetch complete: {results}")
    return results


def get_metrics_summary(db_path: str, account: str = None, days: int = 7) -> list[dict]:
    """直近N日のメトリクスサマリーを返す（アナリスト用）"""
    init_metrics_table(db_path)
    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
        query = """
            SELECT post_id, platform, account, checkpoint,
                   views, likes, replies, saves, shares, fetched_at
            FROM post_metrics
            WHERE fetched_at >= datetime('now', ?)
        """
        params = [f"-{days} days"]
        if account:
            query += " AND account = ?"
            params.append(account)
        query += " ORDER BY fetched_at DESC"
        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]
