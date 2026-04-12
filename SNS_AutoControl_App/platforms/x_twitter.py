"""
X (Twitter) Selenium連携モジュール（@ando_lyo / @shikumiya_ai 両方メイン）
API不使用 — Seleniumによるブラウザ操作ベース（BAN覚悟運用）
既存X_AutoControl_Appのログイン方式を踏襲
"""
import json
import random
import time
from pathlib import Path

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import logging

from .base import PlatformBase, Post, Comment

logger = logging.getLogger(__name__)


class XTwitterPlatform(PlatformBase):
    """Selenium を使ったX操作（API不使用）"""

    # アカウント別Chromeプロファイル
    PROFILE_DIR = {
        "shikumiya_ai": "C:/Users/ryoya/AppData/Local/Google/Chrome/AutomationProfile",
        "ando_lyo": "C:/Users/ryoya/AppData/Local/Google/Chrome/AutomationProfile_ando_lyo",
    }

    def __init__(self, username: str, password: str, cookies_path: str = None, headless: bool = False):
        self.username = username
        self.password = password
        self.cookies_path = cookies_path
        self.driver = None
        self._logged_in = False  # ログイン確認済みフラグ
        self._headless = headless

    # === ドライバ管理 ===

    def _init_driver(self):
        """undetected-chromedriver + Chrome専用プロファイルで自動化検出を回避"""
        if self.driver:
            return

        profile_dir = self.PROFILE_DIR.get(self.username, self.PROFILE_DIR["shikumiya_ai"])
        options = uc.ChromeOptions()
        options.add_argument(f"--user-data-dir={profile_dir}")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--lang=ja-JP")

        self.driver = uc.Chrome(options=options, version_main=146)
        self.driver.set_page_load_timeout(30)
        self.driver.implicitly_wait(10)
        # PIDを保存（クリーンアップ用）
        try:
            self._driver_pid = self.driver.service.process.pid
        except Exception:
            self._driver_pid = None

    # === クッキー管理 ===

    def _save_cookies(self):
        """クッキーをファイルに保存"""
        if self.driver and self.cookies_path:
            cookies = self.driver.get_cookies()
            with open(self.cookies_path, "w") as f:
                json.dump(cookies, f, ensure_ascii=False)

    def _load_cookies(self) -> bool:
        """クッキーを読み込んでログイン状態を復元"""
        if not self.cookies_path or not Path(self.cookies_path).exists():
            return False

        with open(self.cookies_path, "r") as f:
            cookies = json.load(f)

        # auth_tokenの存在確認
        has_auth = any(c.get("name") == "auth_token" for c in cookies)
        if not has_auth:
            return False

        self.driver.get("https://x.com")
        time.sleep(3)

        for cookie in cookies:
            cookie_copy = cookie.copy()
            cookie_copy.pop("sameSite", None)
            cookie_copy.pop("storeId", None)
            cookie_copy.pop("expiry", None)
            try:
                self.driver.add_cookie(cookie_copy)
            except Exception:
                pass

        self.driver.refresh()
        time.sleep(5)

        # タイムラインが表示されたらログイン成功
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'article[data-testid="tweet"]'))
            )
            return True
        except Exception:
            return False

    # === ログイン ===

    def _type_like_human(self, element, text: str):
        """人間のように1文字ずつ入力（短文用）"""
        for char in text:
            element.send_keys(char)
            time.sleep(random.uniform(0.03, 0.12))

    def _paste_text(self, element, text: str):
        """クリップボード経由で貼り付け（長文用）"""
        import pyperclip
        pyperclip.copy(text)
        element.click()
        time.sleep(0.3)
        element.send_keys(Keys.CONTROL, "v")
        time.sleep(1)

    def _login(self):
        """X にログイン（既存X_AutoControl_Appのフローを踏襲）"""
        self._init_driver()
        self.driver.get("https://x.com/i/flow/login")
        time.sleep(5)

        wait = WebDriverWait(self.driver, 30)

        # ユーザー名入力（複数セレクタ対応）
        username_input = None
        for selector in ['input[autocomplete="username"]', 'input[name="text"]', 'input[type="text"]']:
            try:
                username_input = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )
                if username_input:
                    break
            except Exception:
                continue

        if not username_input:
            raise Exception("ユーザー名入力欄が見つかりません")

        self._type_like_human(username_input, self.username)
        time.sleep(0.5)
        username_input.send_keys(Keys.ENTER)
        time.sleep(3)

        # 追加認証（電話番号/ユーザー名確認）
        try:
            extra_input = self.driver.find_element(
                By.CSS_SELECTOR, 'input[data-testid="ocfEnterTextTextInput"]'
            )
            if extra_input:
                extra_input.clear()
                self._type_like_human(extra_input, self.username.replace("@", ""))
                time.sleep(1)
                try:
                    next_btn = self.driver.find_element(
                        By.XPATH,
                        '//span[text()="次へ"]/ancestor::button | //span[text()="Next"]/ancestor::button'
                    )
                    next_btn.click()
                except Exception:
                    extra_input.send_keys(Keys.ENTER)
                time.sleep(3)
        except Exception:
            pass

        # パスワード入力（複数セレクタ対応）
        password_input = None
        for selector in ['input[name="password"]', 'input[type="password"]', 'input[autocomplete="current-password"]']:
            try:
                password_input = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )
                if password_input:
                    break
            except Exception:
                continue

        if not password_input:
            raise Exception("パスワード入力欄が見つかりません")

        # Chrome自動入力をJSでクリアしてから入力
        self.driver.execute_script("arguments[0].value = '';", password_input)
        password_input.clear()
        password_input.send_keys(Keys.CONTROL, "a")
        password_input.send_keys(Keys.DELETE)
        time.sleep(0.3)
        self._type_like_human(password_input, self.password)
        time.sleep(1)

        # ログインボタン
        try:
            login_btn = wait.until(
                EC.element_to_be_clickable((By.XPATH,
                    '//span[text()="ログイン"]/ancestor::button | '
                    '//span[text()="Log in"]/ancestor::button | '
                    '//div[@data-testid="LoginForm_Login_Button"]'
                ))
            )
            login_btn.click()
        except Exception:
            password_input.send_keys(Keys.ENTER)

        time.sleep(10)
        self._save_cookies()

    def _ensure_logged_in(self):
        """ログイン状態を確認し、必要ならログインする。再起動は1回だけ試行"""
        self._init_driver()

        # 既にログイン確認済みならスキップ（毎回ページ遷移しない）
        if self._logged_in and self.driver:
            return

        try:
            self.driver.get("https://x.com/home")
            time.sleep(5)
            if "login" not in self.driver.current_url.lower():
                self._logged_in = True
                return  # 既にログイン済み
        except Exception as e:
            logger.error(f"[致命的] ブラウザ接続失敗: {e}")
            raise RuntimeError("ブラウザの起動に失敗しました。手動でChromeを全て閉じてから再実行してください。")

        # プロファイルにセッションがなければクッキーで試行
        if self._load_cookies():
            return

        # クッキーも無効ならログインフロー
        self._login()

    def _safe_quit_driver(self):
        """ドライバーを安全に終了する。プロセスが残らないことを保証"""
        if self.driver:
            # _init_driver時に保存したPIDを使う
            pid = getattr(self, '_driver_pid', None)
            try:
                self.driver.quit()
            except Exception:
                pass
            # quit()で死ななかった場合、PIDで直接殺す
            if pid:
                try:
                    import subprocess
                    subprocess.run(
                        ["taskkill", "/F", "/PID", str(pid)],
                        capture_output=True, timeout=5,
                    )
                except Exception:
                    pass
            self.driver = None
            self._driver_pid = None
            self._logged_in = False
            time.sleep(3)  # プロファイルロック解放を待つ

    def _safe_navigate(self, url: str, timeout: int = 30):
        """ページ遷移。タイムアウトしたらdriver終了して再起動（1回だけ）"""
        import threading

        success = [False]
        error = [None]

        def navigate():
            try:
                self.driver.get(url)
                success[0] = True
            except Exception as e:
                error[0] = e

        t = threading.Thread(target=navigate, daemon=True)
        t.start()
        t.join(timeout=timeout)

        if not success[0]:
            logger.warning(f"[タイムアウト] {timeout}秒応答なし。driverを再起動します: {url[:60]}")
            self._safe_quit_driver()
            self._ensure_logged_in()
            # 再起動後に1回だけリトライ
            self.driver.get(url)

    def _random_wait(self, min_sec: float = 3, max_sec: float = 8):
        """ランダムな時間待機（人間っぽく）"""
        time.sleep(random.uniform(min_sec, max_sec))

    # === 投稿 ===

    def post(self, post: Post, reply_link: str = None) -> str | None:
        """ツイートを投稿。reply_link指定時は自己リプライにリンクを貼る

        Args:
            post: 投稿データ
            reply_link: 自己リプライに貼るURL（noteリンク等）

        Returns:
            投稿URL or None
        """
        self._ensure_logged_in()
        self._safe_navigate("https://x.com/compose/post")
        time.sleep(3)

        wait = WebDriverWait(self.driver, 15)

        text = post.text or ""
        if post.hashtags:
            text += "\n" + " ".join(f"#{tag}" for tag in post.hashtags)

        editor = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="tweetTextarea_0"]'))
        )
        editor.click()
        self._type_like_human(editor, text)
        self._random_wait(1, 2)

        # 画像添付
        if post.image_path and Path(post.image_path).exists():
            file_input = self.driver.find_element(By.CSS_SELECTOR, 'input[type="file"]')
            file_input.send_keys(str(Path(post.image_path).resolve()))
            time.sleep(3)

        # 投稿ボタン
        post_btn = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="tweetButton"]'))
        )
        post_btn.click()
        time.sleep(5)

        self._save_cookies()

        # 自己リプライにリンクを貼る
        if reply_link:
            try:
                # 自分の最新投稿ページに遷移
                self._safe_navigate(f"https://x.com/{self.username}")
                time.sleep(3)
                # 最新投稿のURLを取得
                latest_links = self.driver.find_elements(
                    By.CSS_SELECTOR, f'a[href*="/{self.username}/status/"]'
                )
                post_url = ""
                for link in latest_links:
                    href = link.get_attribute("href") or ""
                    if "/status/" in href and "/analytics" not in href:
                        post_url = href
                        break

                if post_url:
                    self.reply_to_post(post_url, reply_link)
                    logger.info(f"[自己リプライ] {reply_link}")
            except Exception as e:
                logger.error(f"[自己リプライエラー] {e}")

        return None

    # === コメント取得 ===

    def get_comments(self, post_id: str) -> list[Comment]:
        """指定ツイートのリプライを取得"""
        self._ensure_logged_in()
        self.driver.get(f"https://x.com/{self.username}/status/{post_id}")
        time.sleep(5)

        comments = []
        try:
            replies = self.driver.find_elements(By.CSS_SELECTOR, '[data-testid="tweet"]')
            for i, reply in enumerate(replies[1:], start=1):
                try:
                    text_el = reply.find_element(By.CSS_SELECTOR, '[data-testid="tweetText"]')
                    author_el = reply.find_element(By.CSS_SELECTOR, '[data-testid="User-Name"] a')
                    comments.append(Comment(
                        id=f"{post_id}_reply_{i}",
                        text=text_el.text,
                        author=author_el.get_attribute("href").split("/")[-1],
                        post_id=post_id,
                        created_at="",
                        platform="x",
                    ))
                except Exception:
                    continue
        except Exception:
            pass

        return comments

    # === リプライ ===

    def reply_to_comment(self, comment_id: str, text: str) -> bool:
        """ツイートにリプライ"""
        self._ensure_logged_in()
        post_id = comment_id.split("_reply_")[0] if "_reply_" in comment_id else comment_id
        self.driver.get(f"https://x.com/{self.username}/status/{post_id}")
        time.sleep(3)

        try:
            wait = WebDriverWait(self.driver, 10)
            reply_box = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="tweetTextarea_0"]'))
            )
            reply_box.click()
            self._type_like_human(reply_box, text)
            self._random_wait(1, 2)

            reply_btn = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="tweetButtonInline"]'))
            )
            reply_btn.click()
            time.sleep(3)
            self._save_cookies()
            return True
        except Exception:
            return False

    # === いいね ===

    def like_comment(self, comment_id: str) -> bool:
        """ツイートにいいね"""
        self._ensure_logged_in()
        post_id = comment_id.split("_reply_")[0] if "_reply_" in comment_id else comment_id
        self.driver.get(f"https://x.com/{self.username}/status/{post_id}")
        time.sleep(3)

        try:
            like_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="like"]'))
            )
            like_btn.click()
            self._random_wait(1, 3)
            self._save_cookies()
            return True
        except Exception:
            return False

    # === フォロー ===

    def follow_user(self, target_username: str) -> bool:
        """ユーザーをフォロー"""
        self._ensure_logged_in()
        target = target_username.lstrip("@")
        self._safe_navigate(f"https://x.com/{target}")
        time.sleep(3)

        try:
            # 既にフォロー済みかチェック
            try:
                self.driver.find_element(
                    By.CSS_SELECTOR, '[data-testid$="-unfollow"]'
                )
                return True
            except Exception:
                pass

            follow_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid$="-follow"]'))
            )
            follow_btn.click()
            self._random_wait(1, 3)
            self._save_cookies()
            return True
        except Exception:
            return False

    # === リポスト ===

    def repost(self, post_url: str) -> bool:
        """ツイートをリポスト"""
        self._ensure_logged_in()
        self.driver.get(post_url)
        time.sleep(3)

        try:
            retweet_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="retweet"]'))
            )
            retweet_btn.click()
            time.sleep(1)

            # リポスト確認メニュー
            confirm_btn = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="retweetConfirm"]'))
            )
            confirm_btn.click()
            self._random_wait(1, 3)
            self._save_cookies()
            return True
        except Exception:
            return False

    # === 引用リポスト ===

    def quote_repost(self, post_url: str, text: str) -> bool:
        """ツイートを引用リポスト（dispatchEvent方式）"""
        self._ensure_logged_in()
        self.driver.get(post_url)
        time.sleep(3)

        try:
            # retweet or unretweet ボタンをscrollIntoViewしてからJS click
            retweet_btn = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR,
                    '[data-testid="retweet"], [data-testid="unretweet"]'
                ))
            )
            self.driver.execute_script(
                "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
                retweet_btn
            )
            time.sleep(2)

            # メニュー項目からaタグを探してdispatchEventで引用モーダルを開く
            opened = self.driver.execute_script("""
                const items = document.querySelectorAll('[role="menuitem"]');
                for (const item of items) {
                    if (item.tagName.toLowerCase() === 'a') {
                        const opts = {bubbles: true, cancelable: true, view: window};
                        item.dispatchEvent(new MouseEvent('mousedown', opts));
                        item.dispatchEvent(new MouseEvent('mouseup', opts));
                        item.dispatchEvent(new MouseEvent('click', opts));
                        return true;
                    }
                }
                return false;
            """)
            if not opened:
                return False
            time.sleep(5)

            # 引用テキスト入力 — 複数tweetTextarea_0からモーダル内のものを特定
            editors = WebDriverWait(self.driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[data-testid="tweetTextarea_0"]'))
            )
            editor = None
            for el in editors:
                if el.is_displayed():
                    rect = self.driver.execute_script(
                        "var r = arguments[0].getBoundingClientRect(); return {top: r.top};", el
                    )
                    if 0 < rect["top"] < 800:
                        editor = el
                        break
            if editor is None:
                return False

            # JS focusしてからsend_keysで行ごとに入力
            self.driver.execute_script("arguments[0].focus();", editor)
            time.sleep(0.5)
            lines = text.split("\n")
            for i, line in enumerate(lines):
                editor.send_keys(line)
                if i < len(lines) - 1:
                    editor.send_keys(Keys.ENTER)
            self._random_wait(1, 2)

            # 投稿ボタンをJS clickで押す
            post_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="tweetButton"]'))
            )
            self.driver.execute_script("arguments[0].click();", post_btn)
            time.sleep(5)
            self._save_cookies()
            return True
        except Exception:
            return False

    # === 記事の作成 ===

    def create_article(self, title: str, blocks: list[dict],
                       header_image: str = None,
                       publish: bool = False, reply_link: str = None) -> str | None:
        """X記事を作成（ブロック単位で逐次挿入）

        Args:
            title: 記事タイトル
            blocks: 記事ブロックのリスト。各ブロックは以下の形式:
                {"type": "text", "html": "<p><b>太字</b>テキスト</p>"}
                {"type": "image", "path": "/path/to/image.png"}
                {"type": "code", "code": "print('hello')"}
            header_image: ヘッダー画像パス（5:2推奨）
            publish: True で公開。False で下書き保存
            reply_link: 公開後に引用ポストの自己リプに貼るURL

        Returns:
            記事URL or None
        """
        from selenium.webdriver.common.action_chains import ActionChains

        self._ensure_logged_in()
        self._safe_navigate("https://x.com/compose/articles")
        time.sleep(3)

        wait = WebDriverWait(self.driver, 30)

        # 新規作成ボタン（✎アイコン、左上）を優先。下書きがあっても新規作成できる
        try:
            # create アイコン（aria-label="create"）
            create_icon = self.driver.find_elements(By.CSS_SELECTOR,
                '[aria-label="create"], [data-testid="create-article"]'
            )
            if create_icon:
                self.driver.execute_script("arguments[0].click();", create_icon[0])
                logger.info("[記事] 新規作成ボタン（✎）クリック")
            else:
                # フォールバック: empty_state_button_text（下書きなしの場合）
                create_btn = wait.until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="empty_state_button_text"]'))
                )
                self.driver.execute_script("arguments[0].click();", create_btn)
                logger.info("[記事] 記事を作成ボタンクリック")
        except Exception:
            try:
                links = self.driver.find_elements(By.XPATH,
                    '//span[text()="記事を作成"]/ancestor::a | '
                    '//span[text()="Create article"]/ancestor::a'
                )
                if links:
                    self.driver.execute_script("arguments[0].click();", links[-1])
            except Exception:
                pass
        time.sleep(8)

        # タイトル入力（ダブルクリックでtextareaが出現）
        title_label = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="twitter-article-title"]'))
        )
        ActionChains(self.driver).double_click(title_label).perform()
        time.sleep(1)
        title_input = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'textarea[placeholder="タイトルを追加"]'))
        )
        title_input.clear()
        title_input.send_keys(title)
        time.sleep(1)

        # ヘッダー画像（サムネイル 5:2）
        if header_image:
            self._article_set_header(header_image)

        # 本文エリアにフォーカス
        body_el = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR,
                '[data-testid="composer_label"] [contenteditable="true"]'
            ))
        )
        body_el.click()
        time.sleep(0.5)

        # ブロックを1つずつ逐次挿入
        for i, block in enumerate(blocks):
            block_type = block.get("type", "text")
            logger.info(f"[記事ブロック {i+1}/{len(blocks)}] type={block_type}")

            if block_type == "text":
                self._article_paste_html(body_el, block.get("html", ""))

            elif block_type == "image":
                self._article_insert_image(block.get("path", ""))

            elif block_type == "code":
                self._article_insert_code(block.get("code", ""))

            time.sleep(1)

        article_url = self.driver.current_url
        logger.info(f"[記事作成完了] {article_url}")

        if publish:
            try:
                publish_btn = self.driver.find_element(By.XPATH,
                    '//span[text()="公開する"]/ancestor::button | '
                    '//span[text()="Publish"]/ancestor::button'
                )
                publish_btn.click()
                time.sleep(5)
            except Exception:
                pass

        self._save_cookies()

        # 公開後: 引用ポスト+自己リプライにnoteリンク
        if publish and reply_link and article_url:
            try:
                quote_text = "詳しくはリプから👇"
                quote_post = Post(text=quote_text, link=article_url)
                self.post(quote_post, reply_link=reply_link)
                logger.info(f"[記事引用ポスト+自己リプライ] {reply_link}")
            except Exception as e:
                logger.error(f"[記事引用ポストエラー] {e}")

        return article_url

    def _article_paste_html(self, editor_el, html: str):
        """ClipboardEvent + text/html で書式付きテキストを貼り付け"""
        import re
        # プレーンテキストも用意（フォールバック用）
        plain = re.sub(r'<[^>]+>', '', html).strip()

        self.driver.execute_script("""
            const editor = arguments[0];
            const html = arguments[1];
            const plain = arguments[2];
            editor.focus();

            const clipboardData = new DataTransfer();
            clipboardData.setData('text/html', html);
            clipboardData.setData('text/plain', plain);

            const pasteEvent = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true,
                clipboardData: clipboardData
            });
            editor.dispatchEvent(pasteEvent);
        """, editor_el, html, plain)
        time.sleep(1)

    def _article_insert_image(self, image_path: str):
        """記事エディタの本文中に画像を挿入（クリップボード貼り付け方式）
        PowerShellで画像をクリップボードにコピー → Ctrl+Vで貼り付け
        """
        if not image_path or not Path(image_path).exists():
            logger.warning(f"[画像スキップ] ファイルなし: {image_path}")
            return

        try:
            # エディタにフォーカス
            self.driver.execute_script('''
                const e = document.querySelector('[data-testid="composer"]')
                          || document.querySelector('[data-testid="composer_label"] [contenteditable="true"]');
                if(e){e.focus();}
            ''')
            time.sleep(0.5)

            # 画像をクリップボードにコピー（PowerShell）
            import subprocess
            abs_path = str(Path(image_path).resolve()).replace("'", "''")
            ps_cmd = (
                "Add-Type -AssemblyName System.Windows.Forms; "
                f"[System.Windows.Forms.Clipboard]::SetImage("
                f"[System.Drawing.Image]::FromFile('{abs_path}'))"
            )
            result = subprocess.run(
                ['powershell', '-NoProfile', '-Command', ps_cmd],
                capture_output=True, timeout=10,
            )
            if result.returncode != 0:
                logger.warning(f"[画像クリップボード失敗] {result.stderr.decode('utf-8', errors='replace')[:100]}")
                return

            # Ctrl+Vで貼り付け
            self.driver.switch_to.window(self.driver.current_window_handle)
            time.sleep(0.3)
            editor = self.driver.find_element(By.CSS_SELECTOR,
                '[data-testid="composer_label"] [contenteditable="true"]')
            editor.send_keys(Keys.CONTROL, 'v')
            time.sleep(5)  # 画像アップロード待ち

            logger.info(f"[画像挿入] {Path(image_path).name}")

        except Exception as e:
            logger.error(f"[画像挿入エラー] {e}")

    def _article_set_header(self, image_path: str):
        """記事のヘッダー画像（サムネイル 5:2）を設定（file input方式）"""
        if not image_path or not Path(image_path).exists():
            logger.warning(f"[ヘッダースキップ] ファイルなし: {image_path}")
            return

        try:
            file_inputs = self.driver.find_elements(By.CSS_SELECTOR, 'input[type="file"]')
            if file_inputs:
                file_inputs[0].send_keys(str(Path(image_path).resolve()))
                time.sleep(5)
                for _ in range(10):
                    apply_btn = self.driver.find_elements(By.XPATH,
                        '//span[text()="適用"]/ancestor::button | '
                        '//span[text()="Apply"]/ancestor::button'
                    )
                    if apply_btn:
                        self.driver.execute_script("arguments[0].click();", apply_btn[-1])
                        time.sleep(3)
                        logger.info(f"[ヘッダー設定] {Path(image_path).name}")
                        return
                    time.sleep(1)
                logger.warning("[ヘッダー] 適用ボタンが見つからない")
        except Exception as e:
            logger.error(f"[ヘッダーエラー] {e}")

    def _article_insert_code(self, code: str):
        """記事エディタにコードブロックを挿入（ポップアップ経由）"""
        try:
            # コードブロック挿入ボタンを探す
            code_btns = self.driver.find_elements(By.CSS_SELECTOR,
                '[aria-label="コード"], [aria-label="Code"], '
                'button[data-testid="code-block"]'
            )
            if not code_btns:
                # ツールバーの「+」ボタンから探す
                plus_btns = self.driver.find_elements(By.CSS_SELECTOR,
                    '[aria-label="ブロック追加"], [aria-label="Add block"], '
                    'button[data-testid="add-block"]'
                )
                if plus_btns:
                    plus_btns[-1].click()
                    time.sleep(1)
                    code_btns = self.driver.find_elements(By.XPATH,
                        '//span[contains(text(),"コード")]/ancestor::button | '
                        '//span[contains(text(),"Code")]/ancestor::button'
                    )

            if code_btns:
                code_btns[-1].click()
                time.sleep(1)
                # コード入力エリアを探す
                code_inputs = self.driver.find_elements(By.CSS_SELECTOR,
                    'textarea, pre[contenteditable="true"], [data-testid="code-input"]'
                )
                if code_inputs:
                    code_inputs[-1].click()
                    code_inputs[-1].send_keys(code)
                    time.sleep(1)
                    # 挿入ボタンを探す
                    insert_btns = self.driver.find_elements(By.XPATH,
                        '//span[text()="挿入"]/ancestor::button | '
                        '//span[text()="Insert"]/ancestor::button | '
                        '//span[text()="追加"]/ancestor::button'
                    )
                    if insert_btns:
                        insert_btns[-1].click()
                        time.sleep(1)
                logger.info(f"[コード挿入] {len(code)}文字")
            else:
                logger.warning("[コード挿入失敗] コードボタンが見つからない")
        except Exception as e:
            logger.error(f"[コード挿入エラー] {e}")

    # === 自分の投稿一覧 ===

    def get_my_posts(self, limit: int = 20) -> list[dict]:
        """自分のツイート一覧を取得"""
        self._ensure_logged_in()
        self.driver.get(f"https://x.com/{self.username}")
        time.sleep(5)

        posts = []
        try:
            tweets = self.driver.find_elements(By.CSS_SELECTOR, '[data-testid="tweet"]')
            for tweet in tweets[:limit]:
                try:
                    text_el = tweet.find_element(By.CSS_SELECTOR, '[data-testid="tweetText"]')
                    link_els = tweet.find_elements(By.CSS_SELECTOR, 'a[href*="/status/"]')
                    post_url = link_els[0].get_attribute("href") if link_els else ""
                    posts.append({
                        "text": text_el.text,
                        "url": post_url,
                        "id": post_url.split("/")[-1] if post_url else "",
                    })
                except Exception:
                    continue
        except Exception:
            pass

        return posts

    # === 手動ログイン ===

    def manual_login(self, timeout: int = 90):
        """手動ログインモード（2FA対応）— ブラウザで手動ログイン後にクッキー保存"""
        self._init_driver()
        self.driver.get("https://x.com/login")

        print(f"[手動ログイン] ブラウザでログインしてください（{timeout}秒以内）")
        for i in range(timeout, 0, -10):
            print(f"  残り {i} 秒...")
            time.sleep(10)
            # ログイン完了チェック
            if "home" in self.driver.current_url.lower():
                break

        if "login" not in self.driver.current_url.lower():
            self._save_cookies()
            print("[成功] クッキーを保存しました！次回から自動ログインできます。")
        else:
            print("[失敗] ログインが完了していないようです。")

    # === 検索 ===

    def search_posts(self, query: str, tab: str = "Latest", limit: int = 20) -> list[dict]:
        """キーワードでポストを検索

        Args:
            query: 検索キーワード（ハッシュタグ含む）
            tab: "Top" or "Latest"（新着推奨）
            limit: 取得件数上限

        Returns:
            [{"id", "text", "author", "url", "metrics"}]
        """
        import urllib.parse
        self._ensure_logged_in()
        encoded = urllib.parse.quote(query)
        url = f"https://x.com/search?q={encoded}&src=typed_query"
        if tab == "Latest":
            url += "&f=live"
        self._safe_navigate(url)
        time.sleep(5)

        posts = []
        seen_ids = set()
        scroll_attempts = 0
        max_scrolls = 5

        while len(posts) < limit and scroll_attempts < max_scrolls:
            tweets = self.driver.find_elements(By.CSS_SELECTOR, '[data-testid="tweet"]')
            for tweet in tweets:
                try:
                    text_el = tweet.find_element(By.CSS_SELECTOR, '[data-testid="tweetText"]')
                    link_els = tweet.find_elements(By.CSS_SELECTOR, 'a[href*="/status/"]')
                    author_els = tweet.find_elements(By.CSS_SELECTOR, '[data-testid="User-Name"] a')

                    post_url = ""
                    post_id = ""
                    for link in link_els:
                        href = link.get_attribute("href") or ""
                        if "/status/" in href and "/analytics" not in href:
                            post_url = href
                            post_id = href.split("/status/")[-1].split("?")[0].split("/")[0]
                            break

                    if not post_id or post_id in seen_ids:
                        continue
                    seen_ids.add(post_id)

                    author = ""
                    for a_el in author_els:
                        href = a_el.get_attribute("href") or ""
                        if href and "/status/" not in href:
                            author = href.split("/")[-1]
                            break

                    metrics = self._extract_tweet_metrics(tweet)

                    posts.append({
                        "id": post_id,
                        "text": text_el.text,
                        "author": author,
                        "url": post_url,
                        "metrics": metrics,
                    })
                except Exception:
                    continue

            if len(posts) >= limit:
                break

            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)
            scroll_attempts += 1

        return posts[:limit]

    def _extract_tweet_metrics(self, tweet_element) -> dict:
        """ツイート要素からメトリクス（リプライ数・RT数・いいね数・表示数）を抽出
        implicit waitを一時的に0にして高速化（存在しない要素で10秒待たない）"""
        metrics = {"replies": 0, "retweets": 0, "likes": 0, "views": 0, "bookmarks": 0}
        metric_map = {
            "reply": "replies",
            "retweet": "retweets",
            "like": "likes",
        }
        # implicit waitを0にして高速化（存在しない要素で10秒待たない）
        self.driver.implicitly_wait(0)
        try:
            for testid_key, metric_key in metric_map.items():
                try:
                    el = tweet_element.find_element(
                        By.CSS_SELECTOR, f'[data-testid="{testid_key}"] span'
                    )
                    text = el.text.strip()
                    if text:
                        metrics[metric_key] = self._parse_metric_text(text)
                except Exception:
                    pass

            try:
                analytics_links = tweet_element.find_elements(
                    By.CSS_SELECTOR, 'a[href*="/analytics"]'
                )
                for link in analytics_links:
                    aria = link.get_attribute("aria-label") or ""
                    if aria:
                        metrics["views"] = self._parse_metric_text(
                            aria.replace("件の表示", "").replace("views", "").replace(",", "").strip()
                        )
                    break
            except Exception:
                pass
        finally:
            self.driver.implicitly_wait(10)

        return metrics

    def _parse_metric_text(self, text: str) -> int:
        """'1.2K' '3.5M' '1,234' などを整数に変換"""
        text = text.strip().replace(",", "").replace("件", "").replace(" ", "")
        if not text:
            return 0
        try:
            if text.endswith(("K", "k", "千")):
                return int(float(text[:-1]) * 1000)
            elif text.endswith(("M", "m", "万")):
                return int(float(text[:-1]) * 1000000)
            return int(float(text))
        except (ValueError, IndexError):
            return 0

    def get_user_profile(self, username: str) -> dict | None:
        """ユーザーのプロフィール情報を取得

        Returns:
            {"username", "display_name", "bio", "followers", "following", "verified"}
        """
        self._ensure_logged_in()
        target = username.lstrip("@")
        self._safe_navigate(f"https://x.com/{target}")
        time.sleep(4)

        try:
            wait = WebDriverWait(self.driver, 10)

            display_name = ""
            try:
                name_el = wait.until(
                    EC.presence_of_element_located((
                        By.CSS_SELECTOR, '[data-testid="UserName"] span'
                    ))
                )
                display_name = name_el.text
            except Exception:
                pass

            bio = ""
            try:
                bio_el = self.driver.find_element(
                    By.CSS_SELECTOR, '[data-testid="UserDescription"]'
                )
                bio = bio_el.text
            except Exception:
                pass

            followers = 0
            following = 0
            try:
                links = self.driver.find_elements(
                    By.CSS_SELECTOR,
                    f'a[href="/{target}/followers"], a[href="/{target}/following"], '
                    f'a[href="/{target}/verified_followers"]'
                )
                for link in links:
                    href = link.get_attribute("href") or ""
                    text = link.text or ""
                    if "following" in href and "followers" not in href:
                        following = self._parse_metric_text(text.split()[0] if text else "0")
                    elif "followers" in href:
                        followers = self._parse_metric_text(text.split()[0] if text else "0")
            except Exception:
                pass

            verified = False
            try:
                self.driver.find_element(By.CSS_SELECTOR, '[data-testid="icon-verified"]')
                verified = True
            except Exception:
                pass

            return {
                "username": target,
                "display_name": display_name,
                "bio": bio,
                "followers": followers,
                "following": following,
                "verified": verified,
            }
        except Exception:
            return None

    def get_user_posts(self, username: str, limit: int = 10) -> list[dict]:
        """特定ユーザーの最新ポストを取得"""
        self._ensure_logged_in()
        target = username.lstrip("@")
        self._safe_navigate(f"https://x.com/{target}")
        time.sleep(5)

        posts = []
        seen_ids = set()
        tweets = self.driver.find_elements(By.CSS_SELECTOR, '[data-testid="tweet"]')

        for tweet in tweets[:limit * 2]:
            try:
                text_el = tweet.find_element(By.CSS_SELECTOR, '[data-testid="tweetText"]')
                link_els = tweet.find_elements(By.CSS_SELECTOR, 'a[href*="/status/"]')

                post_url = ""
                post_id = ""
                for link in link_els:
                    href = link.get_attribute("href") or ""
                    if "/status/" in href and "/analytics" not in href:
                        post_url = href
                        post_id = href.split("/status/")[-1].split("?")[0].split("/")[0]
                        break

                if not post_id or post_id in seen_ids:
                    continue
                seen_ids.add(post_id)

                metrics = self._extract_tweet_metrics(tweet)

                posts.append({
                    "id": post_id,
                    "text": text_el.text,
                    "author": target,
                    "url": post_url,
                    "metrics": metrics,
                })
            except Exception:
                continue

        return posts[:limit]

    def like_post(self, post_url: str) -> bool:
        """投稿URLからいいね（既にいいね済みならスキップ）"""
        self._ensure_logged_in()
        self._safe_navigate(post_url)
        time.sleep(3)

        try:
            try:
                self.driver.find_element(By.CSS_SELECTOR, '[data-testid="unlike"]')
                return True  # 既にいいね済み
            except Exception:
                pass

            like_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="like"]'))
            )
            like_btn.click()
            self._random_wait(1, 3)
            self._save_cookies()
            return True
        except Exception:
            return False

    def reply_to_post(self, post_url: str, text: str) -> bool:
        """投稿URLに直接リプライ（ペースト入力）"""
        self._ensure_logged_in()
        self._safe_navigate(post_url)
        time.sleep(3)

        try:
            wait = WebDriverWait(self.driver, 10)
            reply_box = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="tweetTextarea_0"]'))
            )
            reply_box.click()
            time.sleep(0.5)
            self._paste_text(reply_box, text)
            self._random_wait(1, 2)

            reply_btn = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="tweetButtonInline"]'))
            )
            reply_btn.click()
            time.sleep(3)
            self._save_cookies()
            return True
        except Exception:
            return False

    # === クリーンアップ ===

    def close(self):
        """ブラウザを閉じる"""
        if self.driver:
            try:
                self._save_cookies()
            except Exception:
                pass
            self._safe_quit_driver()
