"""
SQLiteデータベース管理
コメント返信履歴、いいね履歴、投稿履歴、Webhookイベントを管理
"""
import json
import sqlite3
import os
from datetime import datetime


class Database:
    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "sns_history.db")
        self.db_path = db_path
        self._init_db()

    def _get_conn(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS replies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    comment_id TEXT UNIQUE NOT NULL,
                    reply_text TEXT NOT NULL,
                    platform TEXT,
                    status TEXT DEFAULT 'posted',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS pending_replies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    comment_id TEXT UNIQUE NOT NULL,
                    comment_text TEXT NOT NULL,
                    reply_text TEXT NOT NULL,
                    platform TEXT,
                    author TEXT,
                    status TEXT DEFAULT 'pending',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS likes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    comment_id TEXT UNIQUE NOT NULL,
                    platform TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL,
                    post_id TEXT,
                    post_url TEXT,
                    text TEXT,
                    image_path TEXT,
                    note_url TEXT,
                    account TEXT DEFAULT '',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS pending_posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL,
                    text TEXT NOT NULL,
                    image_path TEXT,
                    note_url TEXT,
                    account TEXT DEFAULT '',
                    status TEXT DEFAULT 'pending',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS engagement_targets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL DEFAULT 'x',
                    username TEXT NOT NULL,
                    display_name TEXT,
                    bio TEXT,
                    followers INTEGER DEFAULT 0,
                    following INTEGER DEFAULT 0,
                    tier TEXT DEFAULT 'medium',
                    category TEXT DEFAULT '',
                    account TEXT DEFAULT '',
                    active INTEGER DEFAULT 1,
                    relevance_score INTEGER DEFAULT 0,
                    relevance_reasons TEXT DEFAULT '',
                    last_checked TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(platform, username, account)
                );

                CREATE TABLE IF NOT EXISTS engagement_actions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL DEFAULT 'x',
                    action_type TEXT NOT NULL,
                    target_username TEXT NOT NULL,
                    post_id TEXT,
                    post_url TEXT,
                    post_text TEXT,
                    reply_text TEXT,
                    account TEXT DEFAULT '',
                    status TEXT DEFAULT 'completed',
                    quality_score INTEGER DEFAULT 0,
                    quality_reasons TEXT DEFAULT '',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS engagement_daily_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL DEFAULT 'x',
                    account TEXT DEFAULT '',
                    date TEXT NOT NULL,
                    likes INTEGER DEFAULT 0,
                    replies INTEGER DEFAULT 0,
                    follows INTEGER DEFAULT 0,
                    quote_rts INTEGER DEFAULT 0,
                    retweets INTEGER DEFAULT 0,
                    UNIQUE(platform, account, date)
                );

                CREATE TABLE IF NOT EXISTS webhook_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    object_id TEXT,
                    sender_id TEXT,
                    comment_text TEXT,
                    media_id TEXT,
                    parent_id TEXT,
                    raw_payload TEXT,
                    status TEXT DEFAULT 'unprocessed',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
            """)
            # 既存DBにカラムがない場合、追加する（既存データは壊さない）
            for table in ("posts", "pending_posts"):
                try:
                    conn.execute(f"ALTER TABLE {table} ADD COLUMN account TEXT DEFAULT ''")
                except sqlite3.OperationalError:
                    pass
            # スコアカラム追加（既存DB対応）
            for col, col_type, default in [
                ("relevance_score", "INTEGER", "0"),
                ("relevance_reasons", "TEXT", "''"),
            ]:
                try:
                    conn.execute(f"ALTER TABLE engagement_targets ADD COLUMN {col} {col_type} DEFAULT {default}")
                except sqlite3.OperationalError:
                    pass
            for col, col_type, default in [
                ("quality_score", "INTEGER", "0"),
                ("quality_reasons", "TEXT", "''"),
            ]:
                try:
                    conn.execute(f"ALTER TABLE engagement_actions ADD COLUMN {col} {col_type} DEFAULT {default}")
                except sqlite3.OperationalError:
                    pass

    def is_replied(self, comment_id: str) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                "SELECT 1 FROM replies WHERE comment_id = ?", (comment_id,)
            ).fetchone()
            return row is not None

    def save_reply(self, comment_id: str, reply_text: str, platform: str = None):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR IGNORE INTO replies (comment_id, reply_text, platform) VALUES (?, ?, ?)",
                (comment_id, reply_text, platform),
            )

    def save_pending_reply(self, comment_id: str, comment_text: str, reply_text: str,
                           platform: str = None, author: str = None):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR IGNORE INTO pending_replies (comment_id, comment_text, reply_text, platform, author) VALUES (?, ?, ?, ?, ?)",
                (comment_id, comment_text, reply_text, platform, author),
            )

    def get_pending_replies(self) -> list[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM pending_replies WHERE status = 'pending' ORDER BY created_at"
            ).fetchall()
            return [dict(row) for row in rows]

    def get_pending_reply_by_comment_id(self, comment_id: str) -> dict | None:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute(
                "SELECT * FROM pending_replies WHERE comment_id = ? AND status = 'pending'",
                (comment_id,),
            ).fetchone()
            return dict(row) if row else None

    def approve_reply(self, comment_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE pending_replies SET status = 'approved' WHERE comment_id = ?",
                (comment_id,),
            )

    def reject_reply(self, comment_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE pending_replies SET status = 'rejected' WHERE comment_id = ?",
                (comment_id,),
            )

    def is_liked(self, comment_id: str) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                "SELECT 1 FROM likes WHERE comment_id = ?", (comment_id,)
            ).fetchone()
            return row is not None

    def save_like(self, comment_id: str, platform: str = None):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR IGNORE INTO likes (comment_id, platform) VALUES (?, ?)",
                (comment_id, platform),
            )

    def save_post(self, platform: str, post_id: str = None, post_url: str = None,
                  text: str = None, image_path: str = None, note_url: str = None,
                  account: str = ""):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT INTO posts (platform, post_id, post_url, text, image_path, note_url, account)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (platform, post_id, post_url, text, image_path, note_url, account),
            )

    # --- 承認待ち投稿 ---

    def save_pending_post(self, platform: str, text: str,
                          image_path: str = None, note_url: str = None,
                          account: str = ""):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT INTO pending_posts (platform, text, image_path, note_url, account)
                   VALUES (?, ?, ?, ?, ?)""",
                (platform, text, image_path, note_url, account),
            )

    def get_pending_posts(self) -> list[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM pending_posts WHERE status = 'pending' ORDER BY created_at"
            ).fetchall()
            return [dict(row) for row in rows]

    def get_pending_post_by_id(self, post_db_id: int) -> dict | None:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute(
                "SELECT * FROM pending_posts WHERE id = ? AND status = 'pending'",
                (post_db_id,),
            ).fetchone()
            return dict(row) if row else None

    def approve_post(self, post_db_id: int):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE pending_posts SET status = 'approved' WHERE id = ?",
                (post_db_id,),
            )

    def reject_post(self, post_db_id: int):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE pending_posts SET status = 'rejected' WHERE id = ?",
                (post_db_id,),
            )

    # --- Webhookイベント ---

    def save_webhook_event(self, platform: str, event_type: str,
                           object_id: str = None, sender_id: str = None,
                           comment_text: str = None, media_id: str = None,
                           parent_id: str = None, raw_payload: dict = None):
        """Webhookから受信したイベントをDBに保存する"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT INTO webhook_events
                   (platform, event_type, object_id, sender_id, comment_text,
                    media_id, parent_id, raw_payload)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (platform, event_type, object_id, sender_id, comment_text,
                 media_id, parent_id,
                 json.dumps(raw_payload, ensure_ascii=False) if raw_payload else None),
            )

    def get_unprocessed_webhook_events(self, platform: str = None) -> list[dict]:
        """未処理のWebhookイベント一覧を取得する"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            if platform:
                rows = conn.execute(
                    "SELECT * FROM webhook_events WHERE status = 'unprocessed' AND platform = ? ORDER BY created_at",
                    (platform,),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM webhook_events WHERE status = 'unprocessed' ORDER BY created_at"
                ).fetchall()
            return [dict(row) for row in rows]

    def mark_webhook_event_processed(self, event_id: int):
        """Webhookイベントを処理済みにする"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE webhook_events SET status = 'processed' WHERE id = ?",
                (event_id,),
            )

    # --- エンゲージメントターゲット ---

    def upsert_engagement_target(self, platform: str, username: str, account: str = "",
                                  display_name: str = "", bio: str = "",
                                  followers: int = 0, following: int = 0,
                                  tier: str = "medium", category: str = "",
                                  relevance_score: int = 0, relevance_reasons: str = ""):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT INTO engagement_targets
                   (platform, username, display_name, bio, followers, following, tier, category, account,
                    relevance_score, relevance_reasons, last_checked)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                   ON CONFLICT(platform, username, account) DO UPDATE SET
                   display_name=excluded.display_name, bio=excluded.bio,
                   followers=excluded.followers, following=excluded.following,
                   tier=excluded.tier, category=excluded.category,
                   relevance_score=excluded.relevance_score, relevance_reasons=excluded.relevance_reasons,
                   last_checked=CURRENT_TIMESTAMP""",
                (platform, username, display_name, bio, followers, following, tier, category, account,
                 relevance_score, relevance_reasons),
            )

    def get_engagement_targets(self, platform: str = "x", account: str = "",
                                tier: str = None, active_only: bool = True) -> list[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            sql = "SELECT * FROM engagement_targets WHERE platform = ? AND account = ?"
            params = [platform, account]
            if tier:
                sql += " AND tier = ?"
                params.append(tier)
            if active_only:
                sql += " AND active = 1"
            sql += " ORDER BY followers DESC"
            rows = conn.execute(sql, params).fetchall()
            return [dict(row) for row in rows]

    # --- エンゲージメントアクション ---

    def save_engagement_action(self, platform: str, action_type: str, target_username: str,
                                post_id: str = None, post_url: str = None,
                                post_text: str = None, reply_text: str = None,
                                account: str = "",
                                quality_score: int = 0, quality_reasons: str = ""):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT INTO engagement_actions
                   (platform, action_type, target_username, post_id, post_url, post_text, reply_text, account,
                    quality_score, quality_reasons)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (platform, action_type, target_username, post_id, post_url, post_text, reply_text, account,
                 quality_score, quality_reasons),
            )

    def has_engaged_post(self, post_id: str, action_type: str, account: str = "") -> bool:
        """同じ投稿に同じアクションを既に実行済みか"""
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                "SELECT 1 FROM engagement_actions WHERE post_id = ? AND action_type = ? AND account = ?",
                (post_id, action_type, account),
            ).fetchone()
            return row is not None

    def has_engaged_user_today(self, target_username: str, action_type: str, account: str = "") -> bool:
        """今日、同じユーザーに同じアクションを既に実行済みか"""
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                """SELECT 1 FROM engagement_actions
                   WHERE target_username = ? AND action_type = ? AND account = ?
                   AND date(created_at) = date('now')""",
                (target_username, action_type, account),
            ).fetchone()
            return row is not None

    # --- 日次統計 ---

    def increment_daily_stat(self, platform: str, account: str, action_type: str, count: int = 1):
        col_map = {"like": "likes", "reply": "replies", "follow": "follows",
                    "quote_rt": "quote_rts", "retweet": "retweets"}
        col = col_map.get(action_type)
        if not col:
            return
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                f"""INSERT INTO engagement_daily_stats (platform, account, date, {col})
                    VALUES (?, ?, date('now'), ?)
                    ON CONFLICT(platform, account, date) DO UPDATE SET
                    {col} = {col} + ?""",
                (platform, account, count, count),
            )

    def get_daily_stats(self, platform: str = "x", account: str = "", date: str = None) -> dict:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            if date is None:
                date = datetime.now().strftime("%Y-%m-%d")
            row = conn.execute(
                "SELECT * FROM engagement_daily_stats WHERE platform = ? AND account = ? AND date = ?",
                (platform, account, date),
            ).fetchone()
            if row:
                return dict(row)
            return {"likes": 0, "replies": 0, "follows": 0, "quote_rts": 0, "retweets": 0}

    def get_daily_score_summary(self, platform: str = "x", account: str = "", date: str = None) -> dict:
        """日次のスコアサマリーを取得

        Returns:
            {
                "target_avg_relevance": float,  # ターゲット適合スコア平均
                "target_count": int,
                "target_high": int,  # 60点以上
                "target_low": int,   # 20-39点
                "action_avg_quality": float,  # アクション品質スコア平均
                "action_count": int,
                "action_scores_by_type": {"like": avg, "reply": avg, ...},
            }
        """
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        result = {
            "target_avg_relevance": 0.0, "target_count": 0,
            "target_high": 0, "target_low": 0,
            "action_avg_quality": 0.0, "action_count": 0,
            "action_scores_by_type": {},
        }
        with sqlite3.connect(self.db_path) as conn:
            # ターゲット適合スコア
            row = conn.execute(
                """SELECT AVG(CAST(relevance_score AS REAL)) as avg_score,
                          COUNT(*) as cnt,
                          SUM(CASE WHEN CAST(relevance_score AS INTEGER) >= 60 THEN 1 ELSE 0 END) as high,
                          SUM(CASE WHEN CAST(relevance_score AS INTEGER) BETWEEN 20 AND 39 THEN 1 ELSE 0 END) as low
                   FROM engagement_targets
                   WHERE platform = ? AND account = ? AND date(last_checked) = ?""",
                (platform, account, date),
            ).fetchone()
            if row and row[1]:
                result["target_avg_relevance"] = round(row[0] or 0, 1)
                result["target_count"] = row[1]
                result["target_high"] = row[2] or 0
                result["target_low"] = row[3] or 0

            # アクション品質スコア
            row = conn.execute(
                """SELECT AVG(CAST(quality_score AS REAL)) as avg_score, COUNT(*) as cnt
                   FROM engagement_actions
                   WHERE platform = ? AND account = ? AND date(created_at) = ?""",
                (platform, account, date),
            ).fetchone()
            if row and row[1]:
                result["action_avg_quality"] = round(row[0] or 0, 1)
                result["action_count"] = row[1]

            # アクション種別ごとのスコア
            rows = conn.execute(
                """SELECT action_type, AVG(CAST(quality_score AS REAL)) as avg_score, COUNT(*) as cnt
                   FROM engagement_actions
                   WHERE platform = ? AND account = ? AND date(created_at) = ?
                   GROUP BY action_type""",
                (platform, account, date),
            ).fetchall()
            for r in rows:
                result["action_scores_by_type"][r[0]] = {
                    "avg": round(r[1] or 0, 1), "count": r[2]
                }

        return result
