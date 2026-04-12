"""
自動いいねモジュール
自投稿へのコメントに自動でいいねする
"""
import logging
from platforms.base import PlatformBase
from database import Database

logger = logging.getLogger(__name__)


class AutoLike:
    """自投稿のコメントに自動いいね"""

    def __init__(self, platform: PlatformBase, db: Database):
        self.platform = platform
        self.db = db

    def like_new_comments(self) -> int:
        """
        未いいねのコメントに一括いいね

        Returns:
            いいねした件数
        """
        liked_count = 0
        my_posts = self.platform.get_my_posts(limit=20)

        for post in my_posts:
            post_id = post.get("id")
            if not post_id:
                continue

            comments = self.platform.get_comments(post_id)
            for comment in comments:
                if self.db.is_liked(comment.id):
                    continue

                try:
                    success = self.platform.like_comment(comment.id)
                    if success:
                        self.db.save_like(comment.id)
                        liked_count += 1
                        logger.info(f"Liked comment {comment.id} by {comment.author}")
                except Exception as e:
                    logger.warning(f"Failed to like {comment.id}: {e}")

        return liked_count
