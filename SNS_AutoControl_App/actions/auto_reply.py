"""
自投稿コメントへの自動いいね＋返信
Phase 2 で実装する最優先機能
"""
import logging
from platforms.base import PlatformBase, Comment
from ai.claude_cli import generate_reply
from database import Database

logger = logging.getLogger(__name__)


class AutoReply:
    """自投稿のコメントに対して自動でいいね＋返信する"""

    def __init__(self, platform: PlatformBase, db: Database, settings: dict):
        self.platform = platform
        self.db = db
        self.settings = settings

    def check_and_reply(self, auto_approve: bool = False) -> list[dict]:
        """
        新着コメントをチェックし、返信を生成する

        Args:
            auto_approve: Trueなら承認なしで即投稿

        Returns:
            処理結果のリスト（承認待ちor投稿済み）
        """
        results = []

        # 自分の投稿一覧を取得
        my_posts = self.platform.get_my_posts(limit=20)

        for post in my_posts:
            post_id = post.get("id")
            if not post_id:
                continue

            # コメント取得
            comments = self.platform.get_comments(post_id)

            for comment in comments:
                # 既に返信済みならスキップ
                if self.db.is_replied(comment.id):
                    continue

                # いいね
                if self.settings.get("auto_like", True):
                    try:
                        self.platform.like_comment(comment.id)
                        logger.info(f"Liked comment {comment.id}")
                    except Exception as e:
                        logger.warning(f"Failed to like comment {comment.id}: {e}")

                # Claude CLIで返信生成
                reply_text = generate_reply(
                    comment_text=comment.text,
                    author=comment.author,
                    persona=self.settings.get("persona"),
                    tone=self.settings.get("tone"),
                )

                if not reply_text:
                    logger.warning(f"Failed to generate reply for comment {comment.id}")
                    continue

                result = {
                    "comment": comment,
                    "reply_text": reply_text,
                    "status": "pending",
                }

                if auto_approve:
                    # 即投稿
                    success = self.platform.reply_to_comment(comment.id, reply_text)
                    if success:
                        self.db.save_reply(comment.id, reply_text)
                        result["status"] = "posted"
                        logger.info(f"Replied to comment {comment.id}")
                    else:
                        result["status"] = "failed"
                        logger.error(f"Failed to post reply for comment {comment.id}")
                else:
                    # 承認待ちとしてDBに保存
                    self.db.save_pending_reply(
                        comment.id, comment.text, reply_text,
                        platform=comment.platform, author=comment.author,
                    )
                    result["status"] = "pending_approval"

                results.append(result)

        return results
