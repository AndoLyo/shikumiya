"""
プラットフォーム共通インターフェース
各SNSプラットフォームはこのクラスを継承して実装する
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Post:
    """投稿データ"""
    text: str
    image_path: str | None = None
    link: str | None = None
    hashtags: list[str] | None = None


@dataclass
class Comment:
    """コメントデータ"""
    id: str
    text: str
    author: str
    post_id: str
    created_at: str
    platform: str


class PlatformBase(ABC):
    """プラットフォーム共通インターフェース"""

    @abstractmethod
    def post(self, post: Post) -> str | None:
        """投稿を作成し、投稿URLまたはIDを返す"""
        pass

    @abstractmethod
    def get_comments(self, post_id: str) -> list[Comment]:
        """指定投稿のコメント一覧を取得"""
        pass

    @abstractmethod
    def reply_to_comment(self, comment_id: str, text: str) -> bool:
        """コメントに返信"""
        pass

    @abstractmethod
    def like_comment(self, comment_id: str) -> bool:
        """コメントにいいね"""
        pass

    @abstractmethod
    def get_my_posts(self, limit: int = 20) -> list[dict]:
        """自分の投稿一覧を取得"""
        pass
