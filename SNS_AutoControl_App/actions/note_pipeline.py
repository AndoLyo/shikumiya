"""
note連携パイプライン
note記事公開後 → 全SNSに告知投稿を自動生成+投稿+初速ブースト

フロー:
  1. note記事フォルダからarticle.md読み込み
  2. 各SNS向け告知文をClaude CLIで生成（X通常・X長文・IG・Threads）
  3. サムネ画像をGitHub経由でホスティング
  4. IG/Threadsに投稿（API）
  5. X投稿（Selenium）
  6. 初速ブースト（もう1アカウントからいいね+リプ）
  7. DBに記録
"""
import logging
import os
import time
from pathlib import Path

from ai.claude_cli import generate_post_text, _call_claude_cli
from database import Database

logger = logging.getLogger(__name__)

# note記事フォルダのベースパス
NOTE_DRAFTS_BASE = Path(r"C:\Users\ryoya\OneDrive\AI\Claude\note-drafts\publish-ready")


class NotePipeline:
    """note記事 → SNS告知パイプライン"""

    def __init__(self, db: Database, account: str = "ando_lyo"):
        self.db = db
        self.account = account

    def load_article(self, folder_name: str) -> dict | None:
        """記事フォルダからarticle.md+サムネを読み込み

        Args:
            folder_name: フォルダ名（例: "007_テーマ1つで..."）

        Returns:
            {"title", "content", "thumbnail_path", "images_dir", "folder_path"}
        """
        folder = NOTE_DRAFTS_BASE / folder_name
        article_path = folder / "article.md"
        if not article_path.exists():
            article_path = folder / "記事.md"

        if not article_path.exists():
            logger.error(f"記事ファイルが見つかりません: {folder}")
            return None

        content = article_path.read_text(encoding="utf-8")

        # タイトル抽出（最初の # 見出し）
        title = folder_name
        for line in content.split("\n"):
            line = line.strip()
            if line.startswith("# ") and not line.startswith("## "):
                title = line[2:].strip()
                break

        thumbnail = folder / "thumbnail.png"
        images_dir = folder / "images"
        if not images_dir.exists():
            images_dir = folder / "画像"

        return {
            "title": title,
            "content": content,
            "thumbnail_path": str(thumbnail) if thumbnail.exists() else None,
            "images_dir": str(images_dir) if images_dir.exists() else None,
            "folder_path": str(folder),
        }

    def generate_sns_texts(self, title: str, content: str, note_url: str) -> dict:
        """各SNS向けの告知テキストを一括生成

        Returns:
            {"x": str, "x_long": str, "ig": str, "threads": str}
        """
        # 記事の要約を作る（長すぎるのでClaude CLIに全文渡さない）
        summary = content[:1500]

        texts = {}

        # X通常ポスト
        texts["x"] = _call_claude_cli(
            f"""以下のnote記事を告知するX(Twitter)投稿を書いて。

ルール:
- 140字以内
- 記事の一番の価値を端的に
- ハッシュタグ1-2個
- リンクは投稿後にリプライで貼るので本文には不要
- 「記事書きました」系の報告調はNG。読みたくなる切り口で
- 投稿テキストのみ出力

記事タイトル: {title}
記事URL: {note_url}
記事内容:
{summary}""",
            timeout=90,
        )

        # IG
        texts["ig"] = _call_claude_cli(
            f"""以下のnote記事を告知するInstagramキャプションを書いて。

ルール:
- カルーセル投稿のキャプションとして
- 冒頭3行で引きを作る（残りは「もっと見る」の下）
- ハッシュタグ5-8個（末尾配置）
- プロフィールリンクから記事へ誘導するCTA
- 「保存しておくと便利」の一言を入れる
- 投稿テキストのみ出力

記事タイトル: {title}
記事URL: {note_url}
記事内容:
{summary}""",
            timeout=90,
        )

        # Threads
        texts["threads"] = _call_claude_cli(
            f"""以下のnote記事を告知するThreads投稿を書いて。

ルール:
- 100-300文字
- Xとは違う切り口で（質問型・問いかけ型推奨）
- ハッシュタグは1個のみ
- 「この記事に書いた」のような自然な形でリンク誘導
- 投稿テキストのみ出力

記事タイトル: {title}
記事URL: {note_url}
記事内容:
{summary}""",
            timeout=90,
        )

        return texts

    def post_to_ig(self, text: str, image_url: str, account: str = None) -> str | None:
        """IG投稿"""
        from config import get_ig_account
        from platforms.instagram import InstagramPlatform
        from platforms.base import Post

        acc = account or self.account
        token, account_id = get_ig_account(acc)
        ig = InstagramPlatform(token, account_id)

        try:
            result = ig.post(Post(text=text, image_path=image_url))
            if result:
                self.db.save_post("instagram", post_id=str(result), text=text,
                                  image_path=image_url, account=acc)
                logger.info(f"[IG投稿成功] {result}")
            return result
        except Exception as e:
            logger.error(f"[IG投稿エラー] {e}")
            return None

    def post_to_threads(self, text: str, account: str = None) -> str | None:
        """Threads投稿"""
        from config import get_threads_account
        from platforms.threads import ThreadsPlatform
        from platforms.base import Post

        acc = account or self.account
        token, user_id = get_threads_account(acc)
        th = ThreadsPlatform(token, user_id)

        try:
            result = th.post(Post(text=text))
            if result:
                self.db.save_post("threads", post_id=str(result), text=text, account=acc)
                logger.info(f"[Threads投稿成功] {result}")
            return result
        except Exception as e:
            logger.error(f"[Threads投稿エラー] {e}")
            return None

    def post_to_x(self, text: str, note_url: str, account: str = None) -> bool:
        """X投稿（本文 + リプライでリンク）"""
        from config import get_x_account
        from platforms.x_twitter import XTwitterPlatform
        from platforms.base import Post

        acc = account or self.account
        x_creds = get_x_account(acc)
        cookies_path = os.path.join(os.path.dirname(__file__), "..", f"x_cookies_{acc}.json")
        x = XTwitterPlatform(
            username=x_creds["username"],
            password=x_creds["password"],
            cookies_path=cookies_path,
        )

        try:
            # 本文投稿
            x.post(Post(text=text))
            time.sleep(3)

            # リンクをリプライで（外部リンクはリーチ30-50%減のため）
            my_posts = x.get_my_posts(limit=1)
            if my_posts:
                latest_url = my_posts[0].get("url", "")
                if latest_url:
                    x.reply_to_post(latest_url, f"記事はこちら\n{note_url}")

            self.db.save_post("x", text=text, note_url=note_url, account=acc)
            logger.info("[X投稿成功]")
            return True
        except Exception as e:
            logger.error(f"[X投稿エラー] {e}")
            return False
        finally:
            x.close()

    def upload_image_to_github(self, image_path: str) -> str | None:
        """画像をGitHub経由で公開URLにする（IG APIはURL必須）"""
        from actions.auto_post import upload_image_to_github
        try:
            return upload_image_to_github(image_path)
        except Exception as e:
            logger.error(f"[GitHub画像アップロードエラー] {e}")
            return None

    def run_pipeline(self, folder_name: str, note_url: str,
                     platforms: list[str] = None,
                     boost: bool = True) -> dict:
        """フルパイプライン実行

        Args:
            folder_name: 記事フォルダ名
            note_url: note公開後のURL
            platforms: 投稿先（デフォルト: ["x", "ig", "threads"]）
            boost: 初速ブーストするか

        Returns:
            各プラットフォームの投稿結果
        """
        if platforms is None:
            platforms = ["x", "ig", "threads"]

        result = {"article": None, "texts": {}, "posts": {}, "boost": None}

        # 1. 記事読み込み
        article = self.load_article(folder_name)
        if not article:
            logger.error(f"記事読み込み失敗: {folder_name}")
            return result
        result["article"] = {"title": article["title"], "folder": folder_name}
        logger.info(f"[記事] {article['title']}")

        # 2. SNSテキスト生成
        texts = self.generate_sns_texts(article["title"], article["content"], note_url)
        result["texts"] = texts
        for key, text in texts.items():
            if text:
                logger.info(f"[{key}テキスト] {text[:60]}...")

        # 3. 画像アップロード（IG用）
        image_url = None
        if article["thumbnail_path"] and "ig" in platforms:
            image_url = self.upload_image_to_github(article["thumbnail_path"])
            if image_url:
                logger.info(f"[画像URL] {image_url}")

        # 4. 各SNSに投稿
        if "ig" in platforms and texts.get("ig"):
            if image_url:
                ig_result = self.post_to_ig(texts["ig"], image_url)
                result["posts"]["ig"] = "success" if ig_result else "failed"
            else:
                result["posts"]["ig"] = "no_image"
                logger.warning("[IG] 画像URLなし、スキップ")

        if "threads" in platforms and texts.get("threads"):
            th_result = self.post_to_threads(texts["threads"])
            result["posts"]["threads"] = "success" if th_result else "failed"

        if "x" in platforms and texts.get("x"):
            x_result = self.post_to_x(texts["x"], note_url)
            result["posts"]["x"] = "success" if x_result else "failed"

        # 5. 初速ブースト
        if boost and "x" in platforms and result["posts"].get("x") == "success":
            from actions.engagement import XEngagement
            from config import get_x_account
            from platforms.x_twitter import XTwitterPlatform

            boost_account = "shikumiya_ai" if self.account == "ando_lyo" else "ando_lyo"
            boost_creds = get_x_account(boost_account)
            boost_cookies = os.path.join(os.path.dirname(__file__), "..", f"x_cookies_{boost_account}.json")
            boost_x = XTwitterPlatform(
                username=boost_creds["username"],
                password=boost_creds["password"],
                cookies_path=boost_cookies,
            )

            try:
                # 最新投稿のURLを取得
                main_creds = get_x_account(self.account)
                main_cookies = os.path.join(os.path.dirname(__file__), "..", f"x_cookies_{self.account}.json")
                main_x = XTwitterPlatform(
                    username=main_creds["username"],
                    password=main_creds["password"],
                    cookies_path=main_cookies,
                )
                try:
                    posts = main_x.get_my_posts(limit=1)
                    if posts:
                        post_url = posts[0].get("url", "")
                        if post_url:
                            engagement = XEngagement(main_x, self.db, self.account)
                            boost_result = engagement.boost_own_post(post_url, boost_x)
                            result["boost"] = boost_result
                            logger.info(f"[初速ブースト] {boost_result}")
                finally:
                    main_x.close()
            except Exception as e:
                logger.error(f"[ブーストエラー] {e}")
            finally:
                boost_x.close()

        logger.info(f"=== パイプライン完了 ===")
        logger.info(f"  投稿結果: {result['posts']}")
        return result
