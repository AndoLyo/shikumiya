"""
note.com 記事投稿モジュール（SNS_AutoControl_App版）

機能:
- タイトル入力
- 本文入力（Markdown→HTML変換）
- セクション画像の差し込み（h2見出し直下）
- 有料エリア設定
- アイキャッチ画像アップロード
- 公開設定（ハッシュタグ・Xプロモ・価格）
- 投稿ボタンは押さない（人間確認後に手動）

使い方:
    from actions.note_publisher import NotePublisher, parse_article
    article = parse_article("path/to/010_コマンドは使う必要ない")
    pub = NotePublisher()
    pub.start()
    pub.login()
    pub.post_article(article)
    # → ブラウザが開いた状態で停止。人間が確認して「投稿」を押す
    pub.close()
"""
import base64
import logging
import os
import re
import time
from pathlib import Path

import pyautogui
import pyperclip
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

log = logging.getLogger(__name__)

# note記事フォルダのベースパス
NOTE_DRAFTS_BASE = Path(r"C:\Users\ryoya\OneDrive\AI\Claude\note-drafts\publish-ready")


# ═══════════════════════════════════════
#  記事解析
# ═══════════════════════════════════════

def parse_article(folder_path: str) -> dict:
    """article.mdを解析して構造化データを返す

    Returns:
        {
            "title": str,
            "free_content": str,       # 無料部分（Markdown）
            "paid_content": str,       # 有料部分（Markdown）
            "section_images": dict,    # {h2テキスト: 画像パス}
            "thumbnail_path": str,
            "hashtags": list[str],
            "promo_text": str,         # Xプロモ投稿文
            "folder_path": str,
        }
    """
    folder = Path(folder_path)
    # article.md or 記事.md（日本語フォルダ対応）
    article_path = folder / "article.md"
    if not article_path.exists():
        article_path = folder / "記事.md"
    article_md = article_path.read_text(encoding="utf-8")

    # 1. HTMLコメントから画像マッピングを抽出（英語・日本語パス両対応）
    image_map = {}
    comment = re.search(r'<!--(.*?)-->', article_md, re.DOTALL)
    if comment:
        for m in re.finditer(r'##\s+(.+?)\s+→\s+(.+?\.png)', comment.group(1)):
            heading = m.group(1).strip()
            img_rel = m.group(2).strip()
            img_path = folder / img_rel
            if img_path.exists():
                image_map[heading] = str(img_path)
    log.info(f"[解析] セクション画像: {len(image_map)}件")

    # 2. 埋め込みURLを先に抽出（HTMLコメント除去で消える前に）
    embed_urls_raw = re.findall(r'<!-- embed:(https?://\S+?) -->', article_md)

    # 2b. HTMLコメントを除去
    body = re.sub(r'<!--.*?-->\s*', '', article_md, flags=re.DOTALL).strip()

    # 3. タイトル抽出（1行目、Markdown見出し記号を除去）
    lines = body.split('\n')
    title = re.sub(r'^#+\s*', '', lines[0].strip())
    body = '\n'.join(lines[1:]).strip()

    # 4. 無料/有料を分割（「興味あればこちらもどうぞ。」の後で分割）
    paid_marker = "興味あればこちらもどうぞ。"
    if paid_marker in body:
        idx = body.index(paid_marker)
        free_content = body[:idx + len(paid_marker)].strip()
        paid_content = body[idx + len(paid_marker):].strip()
    else:
        free_content = body
        paid_content = ""

    # 5. 埋め込みURL（ステップ2で先に抽出済み）+ 本文分割
    embed_urls = embed_urls_raw
    embed_in = None  # "free" or "paid"
    before_embed = ""
    after_embed = ""
    if embed_urls:
        embed_marker = "<!-- embed:" + embed_urls[0]
        raw_lines = article_md.split('\n')
        embed_line_idx = None
        for idx, line in enumerate(raw_lines):
            if embed_marker in line:
                embed_line_idx = idx
                break

        if embed_line_idx is not None:
            before_line = raw_lines[embed_line_idx - 1].strip() if embed_line_idx > 0 else ""
            # free_content内にあるか
            if before_line and before_line in free_content:
                embed_in = "free"
                split_pos = free_content.index(before_line) + len(before_line)
                before_embed = free_content[:split_pos].strip()
                after_embed = free_content[split_pos:].strip()
            # paid_content内にあるか
            elif before_line and before_line in paid_content:
                embed_in = "paid"
                split_pos = paid_content.index(before_line) + len(before_line)
                before_embed = paid_content[:split_pos].strip()
                after_embed = paid_content[split_pos:].strip()
            if embed_in:
                log.info(f"[解析] embed分割({embed_in}): 前={len(before_embed)}文字, 後={len(after_embed)}文字")
    log.info(f"[解析] 埋め込みURL: {len(embed_urls)}件")

    # 6. ハッシュタグ抽出（末尾の #xxx #yyy 行）
    hashtags = []
    target = paid_content or free_content
    ht_match = re.search(r'\n\s*(#\S+(?:\s+#\S+)*)\s*$', target)
    if ht_match:
        tags_str = ht_match.group(1).strip()
        hashtags = [t.lstrip('#') for t in tags_str.split() if t.startswith('#')]
        # ハッシュタグ行を本文から除去
        if paid_content:
            paid_content = target[:ht_match.start()].strip()
        else:
            free_content = target[:ht_match.start()].strip()
    log.info(f"[解析] ハッシュタグ: {hashtags}")

    # 6. Xプロモ投稿文をsns_posts.md or X投稿.mdから抽出
    promo_text = ""
    sns_path = folder / "sns_posts.md"
    if not sns_path.exists():
        sns_path = folder / "X投稿.md"
    if sns_path.exists():
        sns_content = sns_path.read_text(encoding="utf-8")
        promo_match = re.search(
            r'### Xプロモ投稿文[^\n]*\n\n(.+?)(?=\n---|\n### |\Z)',
            sns_content, re.DOTALL
        )
        if promo_match:
            promo_text = promo_match.group(1).strip()
            promo_text = promo_text.replace("[noteURL]", "").strip()
    log.info(f"[解析] プロモ文: {promo_text[:40]}..." if promo_text else "[解析] プロモ文: なし")

    # 7. サムネイル
    thumbnail = folder / "thumbnail.png"

    # 8. 添付ファイル（README.html → download.zip の順）
    attachments = []
    readme_html = folder / "README.html"
    download_zip = folder / "download.zip"
    if readme_html.exists():
        attachments.append(str(readme_html))
    if download_zip.exists():
        attachments.append(str(download_zip))
    log.info(f"[解析] 添付ファイル: {len(attachments)}件")

    return {
        "title": title,
        "free_content": free_content,
        "paid_content": paid_content,
        "section_images": image_map,
        "thumbnail_path": str(thumbnail) if thumbnail.exists() else None,
        "hashtags": hashtags,
        "promo_text": promo_text,
        "attachments": attachments,
        "embed_urls": embed_urls,
        "embed_in": embed_in,
        "before_embed": before_embed,
        "after_embed": after_embed,
        "folder_path": str(folder),
    }


# ═══════════════════════════════════════
#  ヘルパー関数
# ═══════════════════════════════════════

def _remove_non_bmp(text: str) -> str:
    """BMP外の文字を除去（Seleniumのsend_keys対策）"""
    return "".join(c for c in text if ord(c) <= 0xFFFF)


def _markdown_to_html(text: str) -> str:
    """Markdown → HTML変換（note.comエディタ対応書式）"""
    lines = text.split("\n")
    html_lines = []
    list_type = None
    in_code_block = False
    code_lines = []

    def _close_list():
        nonlocal list_type
        if list_type:
            html_lines.append(f"</{list_type}>")
            list_type = None

    def _inline(text: str) -> str:
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        text = re.sub(r'~~(.+?)~~', r'<s>\1</s>', text)
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
        return text

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("```"):
            if not in_code_block:
                _close_list()
                in_code_block = True
                code_lines = []
            else:
                in_code_block = False
                code_text = "\n".join(code_lines)
                html_lines.append(f"<pre><code>{code_text}</code></pre>")
            continue

        if in_code_block:
            code_lines.append(line)
            continue

        if not stripped:
            _close_list()
            html_lines.append("<br>")
            continue

        if stripped in ("---", "***", "___"):
            _close_list()
            html_lines.append("<hr>")
            continue

        if stripped.startswith("### "):
            _close_list()
            html_lines.append(f"<h3>{_inline(stripped[4:])}</h3>")
            continue
        if stripped.startswith("## "):
            _close_list()
            html_lines.append(f"<h2>{_inline(stripped[3:])}</h2>")
            continue

        if stripped.startswith("> "):
            _close_list()
            html_lines.append(f"<blockquote>{_inline(stripped[2:])}</blockquote>")
            continue

        ol_match = re.match(r'^(\d+)\.\s+(.+)', stripped)
        if ol_match:
            if list_type != "ol":
                _close_list()
                html_lines.append("<ol>")
                list_type = "ol"
            html_lines.append(f"<li>{_inline(ol_match.group(2))}</li>")
            continue

        if stripped.startswith("- ") or stripped.startswith("* "):
            if list_type != "ul":
                _close_list()
                html_lines.append("<ul>")
                list_type = "ul"
            html_lines.append(f"<li>{_inline(stripped[2:])}</li>")
            continue

        _close_list()
        html_lines.append(f"<p>{_inline(stripped)}</p>")

    _close_list()
    if in_code_block:
        code_text = "\n".join(code_lines)
        html_lines.append(f"<pre><code>{code_text}</code></pre>")

    return "".join(html_lines)


# ═══════════════════════════════════════
#  NotePublisher
# ═══════════════════════════════════════

class NotePublisher:
    """note.com記事投稿（投稿ボタンは押さない）"""

    def __init__(self, headless: bool = False):
        self.driver = None
        self.wait = None
        self.headless = headless
        self._screenshot_dir = Path(__file__).parent.parent / "debug_screenshots"

    def start(self):
        """ブラウザ起動"""
        options = Options()
        if self.headless:
            options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--lang=ja")
        options.add_experimental_option("excludeSwitches", ["enable-logging"])
        # note専用Chromeプロファイル（他アプリとの同時起動対応）
        options.add_argument("--user-data-dir=C:/Users/ryoya/AppData/Local/Google/Chrome/AutomationProfile_note")

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 30)
        self._screenshot_dir.mkdir(exist_ok=True)
        log.info("[起動] Chrome起動完了")

    def login(self, email: str, password: str):
        """note.comにログイン"""
        log.info("[ログイン] note.com...")
        self.driver.get("https://note.com/login")
        time.sleep(5)

        email_input = self.wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, '//input[@placeholder="mail@example.com or note ID"]')
            )
        )
        email_input.send_keys(email)

        password_input = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, '//input[@type="password"]'))
        )
        password_input.send_keys(password, Keys.RETURN)

        self.wait.until(EC.url_changes("https://note.com/login"))
        time.sleep(2)
        log.info("[ログイン] 成功")

    def post_article(self, article: dict):
        """記事投稿フロー（投稿ボタンは押さない）

        Args:
            article: parse_article()の戻り値 + price(int)
        """
        log.info("=" * 50)
        log.info(f"[投稿開始] {article['title']}")
        log.info("=" * 50)

        # 新規記事ページ
        self.driver.get("https://note.com/notes/new")
        time.sleep(5)
        self._dismiss_any_dialog()

        # 1. タイトル
        self._input_title(article["title"])
        self._screenshot("01_title")

        # 2. 本文（無料部分）
        if article.get("embed_in") == "free" and article.get("before_embed"):
            self._input_body(article["before_embed"])
            self._screenshot("02_free_before")
            self._embed_at_tail(article["embed_urls"])
            self._screenshot("02b_embeds")
            if article.get("after_embed"):
                self._append_body(article["after_embed"])
                self._screenshot("02c_free_after")
        else:
            self._input_body(article["free_content"])
            self._screenshot("02_free_content")

        # 3. 有料ライン + 有料部分
        if article.get("paid_content"):
            self._insert_paid_line()
            self._screenshot("03_paid_line")

            if article.get("embed_in") == "paid" and article.get("before_embed"):
                # 有料部分のembed前を入力
                self._append_body(article["before_embed"])
                self._screenshot("04_paid_before_embed")

                # カード挿入
                self._embed_at_tail(article["embed_urls"])
                self._screenshot("04b_paid_embed")

                # 有料部分のembed後を入力
                if article.get("after_embed"):
                    self._append_body(article["after_embed"])
                    self._screenshot("04c_paid_after_embed")
            else:
                self._append_body(article["paid_content"])
                self._screenshot("04_paid_content")

        # 4. 添付ファイル（「手順1」の直下に挿入）
        if article.get("attachments"):
            self._insert_attachments_after_heading("手順1", article["attachments"])
            self._screenshot("04a_attachments")

        # 5. セクション画像
        for heading, img_path in article.get("section_images", {}).items():
            self._insert_section_image(heading, img_path)
        if article.get("section_images"):
            self._screenshot("05_section_images")

        # 5. アイキャッチ
        if article.get("thumbnail_path"):
            self.driver.execute_script("window.scrollTo(0, 0);")
            time.sleep(1)
            self._upload_eyecatch(article["thumbnail_path"])
            self._screenshot("06_eyecatch")

        # 6. テキスト確認（React state同期）
        self._ensure_text_synced(article["title"])

        # 7. 「公開に進む」
        self._open_publish_settings()
        self._screenshot("07_publish_settings")
        time.sleep(3)

        # 8. ハッシュタグ
        if article.get("hashtags"):
            self._set_hashtags(article["hashtags"])
            self._screenshot("08_hashtags")

        # 9. 有料設定
        price = article.get("price", 0)
        if price > 0:
            self._set_price(price)
            self._screenshot("09_price")

        # 10. Xプロモーション
        if article.get("promo_text"):
            self._set_x_promo(article["promo_text"])
            self._screenshot("10_x_promo")

        # 11. マガジンに追加（一番下にあるので最後）
        self._add_to_magazine("AIで何か作ってみる開発日記")
        self._screenshot("11_magazine")

        # 12. 有料ライン設定（「試し読みエリアを設定」をクリック）
        if article.get("paid_content"):
            self._open_paid_area_settings()
            self._screenshot("12_paid_area")

        self._screenshot("12_final")
        log.info("=" * 50)
        log.info("[完了] 投稿準備完了。ブラウザを確認してください。")
        log.info("  → 「投稿」ボタンは押していません")
        log.info("  → OKなら手動で「投稿」を押してください")
        log.info("=" * 50)

    # ─── タイトル入力 ───

    def _input_title(self, title: str):
        """タイトル入力（React nativeValueSetter）"""
        log.info(f"[タイトル] {title}")
        title_el = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, 'textarea[placeholder]'))
        )
        clean = _remove_non_bmp(title)
        self.driver.execute_script("""
            var el = arguments[0];
            var text = arguments[1];
            var nativeSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype, 'value'
            ).set;
            nativeSetter.call(el, text);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        """, title_el, clean)
        time.sleep(1)

    # ─── 本文入力 ───

    def _input_body(self, content_md: str):
        """本文入力（insertHTML）"""
        log.info(f"[本文] {len(content_md)}文字のMarkdownを変換して挿入")
        body_el = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, 'div[contenteditable="true"]')
            )
        )
        body_el.click()
        time.sleep(0.3)

        html = _markdown_to_html(_remove_non_bmp(content_md))
        self.driver.execute_script("""
            var el = arguments[0];
            var html = arguments[1];
            el.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('insertHTML', false, html);
        """, body_el, html)
        time.sleep(2)

    def _append_body(self, content_md: str):
        """本文の末尾に追加挿入"""
        log.info(f"[本文追加] {len(content_md)}文字")
        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')

        html = _markdown_to_html(_remove_non_bmp(content_md))
        self.driver.execute_script("""
            var el = arguments[0];
            var html = arguments[1];
            el.focus();
            // 末尾にカーソル移動
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            // 追加挿入
            document.execCommand('insertHTML', false, html);
        """, body_el, html)
        time.sleep(2)

    # ─── 埋め込みURL ───

    def _embed_at_tail(self, urls: list):
        """現在の本文末尾にEnter2回→paste"""
        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')
        body_el.send_keys(Keys.CONTROL, Keys.END)
        time.sleep(0.3)
        body_el.send_keys(Keys.ENTER)
        time.sleep(0.3)
        body_el.send_keys(Keys.ENTER)
        time.sleep(0.5)
        self._paste_embed_urls(urls)

    def _click_after_text_and_paste(self, urls: list):
        """特定テキストの段落末尾をクリック→Enter→pasteでカード挿入"""
        log.info(f"[埋め込み] テキスト位置にカーソル移動してpaste")

        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')

        # 「興味あれば」を含む段落を探してクリック
        target = self.driver.execute_script("""
            var el = arguments[0];
            var paragraphs = el.querySelectorAll('p');
            for (var i = 0; i < paragraphs.length; i++) {
                var text = paragraphs[i].textContent || '';
                if (text.includes('興味あれば') || text.includes('プロンプト集')) {
                    paragraphs[i].scrollIntoView({block: 'center'});
                    return paragraphs[i];
                }
            }
            return null;
        """, body_el)

        if target:
            # 段落の末尾をクリック
            ActionChains(self.driver).move_to_element(target).click().perform()
            time.sleep(0.5)
            # Endキーで行末に移動
            body_el.send_keys(Keys.END)
            time.sleep(0.3)
            # Enterで新しい段落を作る
            body_el.send_keys(Keys.ENTER)
            time.sleep(0.5)
        else:
            log.warning("[埋め込み] ターゲット段落が見つかりません")

        # URLをpaste
        for i, url in enumerate(urls):
            self.driver.execute_script("""
                var el = arguments[0];
                var url = arguments[1];
                el.focus();
                var dt = new DataTransfer();
                dt.setData('text/plain', url);
                var pasteEvent = new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true,
                    clipboardData: dt
                });
                el.dispatchEvent(pasteEvent);
                if (!pasteEvent.defaultPrevented) {
                    document.execCommand('insertText', false, url);
                }
            """, body_el, url)

            time.sleep(3)
            body_el.send_keys(Keys.ENTER)
            time.sleep(2)
            log.info(f"[埋め込み] {i+1}/{len(urls)}: {url}")

    def _paste_embed_urls(self, urls: list):
        """URLをClipboardEvent paste方式で埋め込みカード化する（末尾にpaste）"""
        log.info(f"[埋め込み] {len(urls)}件のURLをpaste")

        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')

        for i, url in enumerate(urls):
            success = self.driver.execute_script("""
                var el = arguments[0];
                var url = arguments[1];

                // カーソルは既にEnter2回で正しい位置にある
                el.focus();

                // ClipboardEvent を発火（text/plain にURLをセット）
                var dt = new DataTransfer();
                dt.setData('text/plain', url);
                var pasteEvent = new ClipboardEvent('paste', {
                    bubbles: true,
                    cancelable: true,
                    clipboardData: dt
                });
                el.dispatchEvent(pasteEvent);

                // pasteイベントがキャンセルされなかった場合のフォールバック
                if (!pasteEvent.defaultPrevented) {
                    document.execCommand('insertText', false, url);
                }

                return pasteEvent.defaultPrevented;
            """, body_el, url)

            time.sleep(3)  # エディタがURL検知→カード化を待つ

            # Enterで変換を確実にトリガー
            body_el.send_keys(Keys.ENTER)
            time.sleep(2)

            log.info(f"[埋め込み] {i+1}/{len(urls)}: {url} (prevented={success})")

    # ─── 有料ライン ───

    def _insert_paid_line(self):
        """有料エリアの区切りを挿入"""
        log.info("[有料ライン] 挿入中...")
        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')

        # 末尾にカーソル移動してEnter
        self.driver.execute_script("""
            var el = arguments[0];
            el.focus();
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        """, body_el)
        body_el.send_keys(Keys.ENTER)
        time.sleep(1)

        # 「+」ボタンを探してクリック
        plus_btn = self._find_plus_button()
        if not plus_btn:
            log.warning("[有料ライン] '+'ボタンが見つかりません → 公開設定で手動設定してください")
            return False

        self.driver.execute_script("arguments[0].click();", plus_btn)
        time.sleep(1.5)

        # メニューから「有料エリア」を探す
        paid_option = self.driver.execute_script("""
            var items = document.querySelectorAll(
                'button, [role="menuitem"], [role="option"], li, a, div[class*="menu"] div'
            );
            for (var i = 0; i < items.length; i++) {
                var el = items[i];
                if (el.offsetParent === null) continue;
                var text = (el.textContent || '').trim();
                if (text.includes('有料') || text.includes('つづきを読む')) {
                    return el;
                }
            }
            return null;
        """)

        if paid_option:
            self.driver.execute_script("arguments[0].click();", paid_option)
            time.sleep(2)
            log.info("[有料ライン] 挿入成功")
            return True

        # 見つからない場合はメニュー項目をダンプ
        self._dump_menu_items()
        log.warning("[有料ライン] メニューに有料エリアが見つかりません → Escで閉じます")
        body_el.send_keys(Keys.ESCAPE)
        time.sleep(0.5)
        return False

    # ─── セクション画像 ───

    def _insert_section_image(self, heading_text: str, image_path: str):
        """h2見出しの直下にセクション画像を挿入（クリップボード貼り付け方式）

        「+」メニュー→「画像」はファイルダイアログが開くため使わない。
        代わりに画像をクリップボードにコピーしてCtrl+Vで貼り付ける。
        """
        short = heading_text[:15]
        log.info(f"[セクション画像] '{short}...' → {os.path.basename(image_path)}")

        # h2要素を見つける
        h2_el = self.driver.execute_script("""
            var h2s = document.querySelectorAll(
                'div[contenteditable="true"] h2'
            );
            var target = arguments[0];
            for (var i = 0; i < h2s.length; i++) {
                var text = h2s[i].textContent.trim();
                if (text.includes(target)) return h2s[i];
            }
            return null;
        """, heading_text[:20])

        if not h2_el:
            log.warning(f"  h2が見つかりません: {heading_text}")
            return False

        # h2の直後にカーソルを配置してEnter → 空行作成
        self.driver.execute_script("""
            var h2 = arguments[0];
            h2.scrollIntoView({block: 'center'});
            var range = document.createRange();
            range.setStartAfter(h2);
            range.collapse(true);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        """, h2_el)
        time.sleep(0.5)

        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')
        body_el.send_keys(Keys.ENTER)
        time.sleep(0.5)

        # 画像をクリップボードにコピー
        if not self._copy_image_to_clipboard(image_path):
            log.warning(f"  クリップボードコピー失敗 → スキップ")
            return False

        # Ctrl+Vで貼り付け（ブラウザウィンドウにフォーカスしてから）
        self.driver.switch_to.window(self.driver.current_window_handle)
        time.sleep(0.3)
        body_el.send_keys(Keys.CONTROL, 'v')
        time.sleep(5)  # エディタが画像を処理・アップロードするのを待つ

        log.info(f"  クリップボード貼り付け完了")
        return True

    def _copy_image_to_clipboard(self, image_path: str) -> bool:
        """PowerShell経由で画像をクリップボードにコピー"""
        import subprocess
        abs_path = os.path.abspath(image_path).replace("'", "''")
        ps_cmd = (
            "Add-Type -AssemblyName System.Windows.Forms; "
            f"[System.Windows.Forms.Clipboard]::SetImage("
            f"[System.Drawing.Image]::FromFile('{abs_path}'))"
        )
        try:
            result = subprocess.run(
                ['powershell', '-NoProfile', '-Command', ps_cmd],
                capture_output=True, timeout=10,
            )
            if result.returncode == 0:
                log.debug(f"  クリップボードにコピー: {os.path.basename(image_path)}")
                return True
            log.warning(f"  PowerShellエラー: {result.stderr.decode('utf-8', errors='replace')[:100]}")
            return False
        except Exception as e:
            log.warning(f"  クリップボードコピー例外: {e}")
            return False

    # ─── アイキャッチ ───

    def _upload_eyecatch(self, image_path: str):
        """アイキャッチ画像をアップロード"""
        log.info(f"[アイキャッチ] {os.path.basename(image_path)}")

        # 「画像を追加」ボタン（aria-label）
        eyecatch_btn = self.driver.execute_script("""
            var btns = document.querySelectorAll('button[aria-label]');
            for (var i = 0; i < btns.length; i++) {
                var label = btns[i].getAttribute('aria-label') || '';
                if (label.includes('画像を追加') || label.includes('アイキャッチ')) {
                    if (btns[i].offsetParent !== null) return btns[i];
                }
            }
            return null;
        """)

        if not eyecatch_btn:
            log.warning("[アイキャッチ] ボタンが見つかりません")
            return False

        self.driver.execute_script(
            "arguments[0].scrollIntoView({block:'center'}); arguments[0].click();",
            eyecatch_btn
        )
        time.sleep(2)

        # 「画像をアップロード」ボタン
        upload_btn = self.driver.execute_script("""
            var btns = document.querySelectorAll('button');
            for (var i = 0; i < btns.length; i++) {
                if (btns[i].offsetParent === null) continue;
                if (btns[i].textContent.trim().includes('画像をアップロード')) return btns[i];
            }
            return null;
        """)

        if upload_btn:
            upload_btn.click()
            time.sleep(2)

        # ファイルアップロード
        uploaded = self._upload_file_input(image_path)
        if not uploaded and not self.headless:
            uploaded = self._upload_via_dialog(image_path)

        # ファイルダイアログが残っていたら閉じる
        time.sleep(1)
        self._close_file_dialog_win32()

        if uploaded:
            time.sleep(8)  # アイキャッチはサイズ大きいので待つ
            self._dismiss_crop_modal()
            log.info("[アイキャッチ] アップロード成功")
        else:
            log.warning("[アイキャッチ] アップロード失敗")

        return uploaded

    # ─── 有料ライン設定 ───

    def _open_paid_area_settings(self):
        """「試し読みエリアを設定」ボタンをクリックして有料ライン設定画面を開く"""
        log.info("[有料ライン] 「試し読みエリアを設定」をクリック...")

        btn = self.driver.execute_script("""
            var btns = document.querySelectorAll('button');
            for (var i = 0; i < btns.length; i++) {
                var text = (btns[i].textContent || '').trim();
                if (text.includes('試し読みエリアを設定') || text.includes('有料エリア設定')) {
                    btns[i].scrollIntoView({block: 'center'});
                    return btns[i];
                }
            }
            return null;
        """)

        if btn:
            self.driver.execute_script("arguments[0].click();", btn)
            time.sleep(3)
            log.info("[有料ライン] 設定画面を表示")
        else:
            log.warning("[有料ライン] 「試し読みエリアを設定」ボタンが見つかりません")

    # ─── ファイル添付 ───

    def _insert_attachments_after_heading(self, heading_keyword: str, file_paths: list):
        """指定h2の直下に添付ファイルを挿入"""
        log.info(f"[添付] 「{heading_keyword}」の直下に{len(file_paths)}件添付")

        # h2を見つけてその直後にカーソル移動
        h2_el = self.driver.execute_script("""
            var h2s = document.querySelectorAll('div[contenteditable="true"] h2');
            var keyword = arguments[0];
            for (var i = 0; i < h2s.length; i++) {
                if (h2s[i].textContent.includes(keyword)) return h2s[i];
            }
            return null;
        """, heading_keyword)

        if not h2_el:
            log.warning(f"[添付] h2「{heading_keyword}」が見つかりません → 末尾に添付")
            for fp in file_paths:
                self._insert_file_attachment(fp)
            return

        # h2の直後にカーソル配置
        self.driver.execute_script("""
            var h2 = arguments[0];
            h2.scrollIntoView({block: 'center'});
            var range = document.createRange();
            range.setStartAfter(h2);
            range.collapse(true);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        """, h2_el)
        time.sleep(0.5)

        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')
        body_el.send_keys(Keys.ENTER)
        time.sleep(0.5)

        for fp in file_paths:
            self._insert_file_at_cursor(fp)

    def _insert_file_at_cursor(self, file_path: str):
        """現在のカーソル位置にファイルを添付"""
        fname = os.path.basename(file_path)
        log.info(f"[添付] {fname}")

        # 「+」ボタン → 「ファイル」メニュー
        plus_btn = self._find_plus_button()
        if not plus_btn:
            log.warning(f"[添付] '+'ボタンが見つかりません → スキップ")
            return False

        self.driver.execute_script("arguments[0].click();", plus_btn)
        time.sleep(1.5)

        file_option = self.driver.execute_script("""
            var items = document.querySelectorAll(
                'button, [role="menuitem"], [role="option"], li, a'
            );
            for (var i = 0; i < items.length; i++) {
                var el = items[i];
                if (el.offsetParent === null) continue;
                var text = (el.textContent || '').trim();
                if (text === 'ファイル' || text === 'File') return el;
            }
            return null;
        """)

        if not file_option:
            log.warning(f"[添付] メニューに「ファイル」が見つかりません → スキップ")
            self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]').send_keys(Keys.ESCAPE)
            return False

        self.driver.execute_script("arguments[0].click();", file_option)
        time.sleep(2)

        uploaded = self._upload_file_input(file_path)
        time.sleep(1)
        self._close_file_dialog_win32()

        if uploaded:
            time.sleep(5)
            log.info(f"[添付] {fname} 成功")
        else:
            log.warning(f"[添付] {fname} 失敗")

        return uploaded

    def _insert_file_attachment(self, file_path: str):
        """「+」メニュー→「ファイル」で添付（file input経由）"""
        fname = os.path.basename(file_path)
        log.info(f"[添付] {fname}")

        body_el = self.driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"]')

        # 末尾にカーソル移動
        self.driver.execute_script("""
            var el = arguments[0];
            el.focus();
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        """, body_el)
        body_el.send_keys(Keys.ENTER)
        time.sleep(1)

        # 「+」ボタン → メニューから「ファイル」を選択
        plus_btn = self._find_plus_button()
        if not plus_btn:
            log.warning(f"[添付] '+'ボタンが見つかりません → スキップ")
            return False

        self.driver.execute_script("arguments[0].click();", plus_btn)
        time.sleep(1.5)

        file_option = self.driver.execute_script("""
            var items = document.querySelectorAll(
                'button, [role="menuitem"], [role="option"], li, a'
            );
            for (var i = 0; i < items.length; i++) {
                var el = items[i];
                if (el.offsetParent === null) continue;
                var text = (el.textContent || '').trim();
                if (text === 'ファイル' || text === 'File') return el;
            }
            return null;
        """)

        if not file_option:
            log.warning(f"[添付] メニューに「ファイル」が見つかりません → スキップ")
            body_el.send_keys(Keys.ESCAPE)
            return False

        self.driver.execute_script("arguments[0].click();", file_option)
        time.sleep(2)

        # file inputにファイルを送信
        uploaded = self._upload_file_input(file_path)

        # ファイルダイアログが残っていたら閉じる
        time.sleep(1)
        self._close_file_dialog_win32()

        if uploaded:
            time.sleep(5)  # アップロード完了待ち
            log.info(f"[添付] {fname} アップロード成功")
        else:
            log.warning(f"[添付] {fname} アップロード失敗")

        return uploaded

    # ─── マガジン追加 ───

    def _add_to_magazine(self, magazine_name: str):
        """マガジンに記事を追加"""
        log.info(f"[マガジン] 「{magazine_name}」に追加中...")

        # サイドバーの「記事の追加」をクリック
        self.driver.execute_script("""
            var els = document.querySelectorAll('a, button, div, li');
            for (var i = 0; i < els.length; i++) {
                if (els[i].offsetParent === null) continue;
                var text = (els[i].textContent || '').trim();
                if (text === '記事の追加') { els[i].click(); return; }
            }
        """)
        time.sleep(2)

        # マガジン名を含む行を探し、その行の「追加」ボタンをクリック
        result = self.driver.execute_script("""
            var name = arguments[0];
            // ページ内のテキストノードからマガジン名を含む要素を探す
            var allEls = document.querySelectorAll('*');
            for (var i = 0; i < allEls.length; i++) {
                var el = allEls[i];
                if (el.children.length > 5) continue;  // 大きなコンテナは除外
                var text = (el.textContent || '').trim();

                if (text.includes(name)) {
                    // 「追加済」チェック
                    if (text.includes('追加済')) return 'already_added';

                    // この要素の親階層で「追加」ボタンを探す
                    var container = el;
                    for (var depth = 0; depth < 5; depth++) {
                        container = container.parentElement;
                        if (!container) break;
                        var btn = container.querySelector('button');
                        if (btn && btn.textContent.trim() === '追加') {
                            btn.scrollIntoView({block: 'center'});
                            btn.click();
                            return 'clicked';
                        }
                    }
                }
            }
            return 'not_found';
        """, magazine_name)

        if result == 'already_added':
            log.info(f"[マガジン] 既に追加済み")
        elif result == 'clicked':
            time.sleep(1)
            log.info(f"[マガジン] 「{magazine_name}」に追加完了")
        else:
            log.warning(f"[マガジン] 「{magazine_name}」が見つかりません")

    # ─── 公開設定 ───

    def _open_publish_settings(self):
        """「公開に進む」をクリック"""
        log.info("[公開設定] 「公開に進む」をクリック...")
        self._dismiss_any_dialog()

        # React state同期のためイベント発火
        self.driver.execute_script("""
            var title = document.querySelector('textarea[placeholder]');
            if (title) {
                title.focus();
                title.dispatchEvent(new Event('input', { bubbles: true }));
                title.dispatchEvent(new Event('change', { bubbles: true }));
            }
            var body = document.querySelector('div[contenteditable="true"]');
            if (body) {
                body.focus();
                body.dispatchEvent(new Event('input', { bubbles: true }));
            }
        """)
        time.sleep(1)

        for attempt in range(3):
            self._dismiss_any_dialog()

            publish_btn = self.driver.execute_script("""
                var btns = document.querySelectorAll('button');
                for (var i = 0; i < btns.length; i++) {
                    if (btns[i].offsetParent === null) continue;
                    if (btns[i].textContent.trim().includes('公開に進む')) return btns[i];
                }
                return null;
            """)

            if not publish_btn:
                log.error("[公開設定] 「公開に進む」ボタンが見つかりません")
                return False

            self.driver.execute_script("arguments[0].click();", publish_btn)
            time.sleep(3)

            # バリデーションエラーダイアログが出たか確認
            error = self.driver.execute_script("""
                var body = document.body.textContent || '';
                return body.includes('入力してください');
            """)
            if error:
                log.warning(f"[公開設定] バリデーションエラー（試行{attempt+1}/3）")
                self._dismiss_any_dialog()
                time.sleep(2)
                continue

            log.info("[公開設定] 公開設定画面を表示")
            return True

        log.error("[公開設定] バリデーションエラーが解消できません")
        return False

    def _set_hashtags(self, tags: list[str]):
        """ハッシュタグ入力"""
        log.info(f"[ハッシュタグ] {tags}")

        hashtag_input = self.driver.execute_script("""
            var selectors = [
                'input[placeholder*="タグ"]',
                'input[placeholder*="ハッシュタグ"]',
                'input[placeholder*="tag"]',
                '[class*="hashtag"] input',
                '[class*="tag"] input',
                '[class*="Tag"] input'
            ];
            for (var s = 0; s < selectors.length; s++) {
                var els = document.querySelectorAll(selectors[s]);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].offsetParent !== null) return els[i];
                }
            }
            return null;
        """)

        if not hashtag_input:
            log.warning("[ハッシュタグ] 入力フィールドが見つかりません")
            return

        for tag in tags:
            tag_text = tag.lstrip("#")
            hashtag_input.click()
            time.sleep(0.2)
            hashtag_input.send_keys(tag_text)
            time.sleep(0.2)
            hashtag_input.send_keys(Keys.RETURN)
            time.sleep(0.5)

        log.info("[ハッシュタグ] 入力完了")

    def _set_price(self, price: int):
        """有料設定（価格入力）

        noteの公開設定UI:
        1. サイドバー「記事タイプ」をクリック
        2. 「有料」ラジオボタンを選択 → 価格入力欄が出現
        3. 価格を入力
        """
        log.info(f"[有料設定] {price}円")

        # サイドバーの「記事タイプ」をクリックして遷移
        self.driver.execute_script("""
            var links = document.querySelectorAll('a, button, [role="tab"], li, div');
            for (var i = 0; i < links.length; i++) {
                var el = links[i];
                if (el.offsetParent === null) continue;
                var text = (el.textContent || '').trim();
                if (text === '記事タイプ') {
                    el.click();
                    return true;
                }
            }
            return false;
        """)
        time.sleep(2)

        # 「有料」ラジオボタンをActionChainsでクリック（React対応）
        paid_radio = self.driver.execute_script("""
            var radios = document.querySelectorAll('input[type="radio"]');
            for (var i = 0; i < radios.length; i++) {
                var parent = radios[i].closest('label, div');
                if (!parent) continue;
                var text = (parent.textContent || '').trim();
                if (text === '有料' || text.startsWith('有料')) return radios[i];
            }
            return null;
        """)
        paid_clicked = False
        if paid_radio:
            ActionChains(self.driver).move_to_element(paid_radio).click().perform()
            paid_clicked = True

        if paid_clicked:
            log.info("[有料設定] 「有料」選択")
            time.sleep(2)
        else:
            log.warning("[有料設定] 「有料」ラジオボタンが見つかりません")
            return

        # 価格入力フィールド（「有料」選択後に出現する）
        # noteのUI: placeholder="300"（最低価格）のinput[type=text]
        price_input = self.driver.execute_script("""
            var inputs = document.querySelectorAll(
                'input[type="text"], input[type="number"], input[type="tel"]'
            );
            // 1. placeholderが数字のみ → 価格入力
            for (var i = 0; i < inputs.length; i++) {
                var el = inputs[i];
                if (el.offsetParent === null) continue;
                var ph = el.getAttribute('placeholder') || '';
                if (/^\\d+$/.test(ph)) return el;
            }
            // 2. 「価格」テキストの近くにある入力
            for (var i = 0; i < inputs.length; i++) {
                var el = inputs[i];
                if (el.offsetParent === null) continue;
                var parent = el.closest('div, label, section');
                var text = (parent ? parent.textContent : '') || '';
                if (text.includes('価格')) return el;
            }
            return null;
        """)

        if price_input:
            price_input.click()
            time.sleep(0.3)
            # 既存の値をクリアして入力
            self.driver.execute_script("""
                var el = arguments[0];
                el.value = '';
                el.dispatchEvent(new Event('input', { bubbles: true }));
            """, price_input)
            price_input.send_keys(str(price))
            price_input.send_keys(Keys.TAB)  # フォーカス外してバリデーション発火
            time.sleep(1)
            log.info(f"[有料設定] 価格 {price}円 入力完了")
        else:
            log.warning("[有料設定] 価格入力フィールドが見つかりません")
            self._dump_publish_inputs()

    def _set_x_promo(self, promo_text: str):
        """Xプロモーション設定（SNSプロモーション機能）

        noteのUI（記事タイプ > 有料 > セール欄）:
          ○ 設定しない
          ○ タイムセール
          ○ SNSプロモーション機能 ← これを選択
          ○ 数量限定販売
        選択後に展開:
          - 0円で販売（割引価格入力）
          - Xアカウント連携
          - プロモ投稿テキスト
          - 「投稿する内容を保存」ボタン
        """
        log.info("[Xプロモ] 設定中...")

        # SNSプロモーションのラジオボタンをActionChainsでクリック（React対応）
        promo_radio = self.driver.execute_script("""
            var radios = document.querySelectorAll('input[type="radio"]');
            for (var i = 0; i < radios.length; i++) {
                var parent = radios[i].closest('label, div, li');
                if (!parent) continue;
                var text = (parent.textContent || '').trim();
                if (text.includes('SNSプロモーション')) return radios[i];
            }
            return null;
        """)

        if promo_radio:
            ActionChains(self.driver).move_to_element(promo_radio).click().perform()
            log.info("[Xプロモ] ActionChainsでラジオクリック")
            time.sleep(3)
        else:
            log.warning("[Xプロモ] 「SNSプロモーション機能」ラジオが見つかりません")
            self._dump_publish_inputs()
            return

        self._screenshot("x_promo_expanded")

        # 展開後: 割引価格入力（0円 = リポストで無料）
        self.driver.execute_script("""
            var inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="tel"]');
            for (var i = 0; i < inputs.length; i++) {
                var el = inputs[i];
                if (el.offsetParent === null) continue;
                var parent = el.closest('div, label');
                var text = (parent ? parent.textContent : '') || '';
                if (text.includes('円で販売') || text.includes('割引')) {
                    el.value = '0';
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }
            }
            return false;
        """)
        time.sleep(1)
        log.info("[Xプロモ] 割引価格: 0円（リポストで無料）")

        # SNSプロモ選択後、textareaにプロモ投稿文を入力
        if promo_text:
            # textareaをスクロールして表示+JS経由で値を設定
            result = self.driver.execute_script("""
                var areas = document.querySelectorAll('textarea');
                for (var i = 0; i < areas.length; i++) {
                    var el = areas[i];
                    el.scrollIntoView({block: 'center'});
                    // nativeValueSetterでReactのstate更新
                    var nativeSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype, 'value'
                    ).set;
                    nativeSetter.call(el, arguments[0]);
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    el.focus();
                    return true;
                }
                return false;
            """, _remove_non_bmp(promo_text))

            if result:
                time.sleep(1)
                log.info(f"[Xプロモ] 投稿文入力完了: {promo_text[:40]}...")
            else:
                log.warning("[Xプロモ] テキストエリアが見つかりません")

        time.sleep(1)

        # 「投稿する内容を保存」をJSクリック
        self.driver.execute_script("""
            var btns = document.querySelectorAll('button');
            for (var i = 0; i < btns.length; i++) {
                var text = (btns[i].textContent || '').trim();
                if (text.includes('投稿する内容を保存')) {
                    btns[i].scrollIntoView({block: 'center'});
                    btns[i].click();
                    return;
                }
            }
        """)
        time.sleep(2)
        log.info("[Xプロモ] 「投稿する内容を保存」クリック")

        self._screenshot("x_promo_saved")

    # ─── ユーティリティ ───

    def _close_file_dialog_win32(self):
        """Windows APIでファイルダイアログだけを安全に閉じる（他のウィンドウには触らない）"""
        try:
            import ctypes
            user32 = ctypes.windll.user32
            WM_CLOSE = 0x0010
            # #32770 = Windowsの標準ダイアログ（ファイルを開く/保存）のクラス名
            dialog = user32.FindWindowW("#32770", None)
            if dialog:
                user32.PostMessageW(dialog, WM_CLOSE, 0, 0)
                time.sleep(1)
                log.debug("[Win32] ファイルダイアログを閉じました")
                return True
            return False
        except Exception as e:
            log.debug(f"[Win32] ダイアログ検出なし: {e}")
            return False

    def _find_plus_button(self):
        """エディタの「+」ボタンを探す"""
        result = self.driver.execute_script("""
            // 1. 明示的なclass名で探す
            var selectors = [
                'button[class*="plus" i]',
                'button[class*="Plus"]',
                'button[class*="add-block" i]',
                'button[class*="AddBlock"]',
                '[class*="side-menu"] button',
                '[class*="SideMenu"] button',
                '[class*="floating"] button',
                '[class*="Floating"] button'
            ];
            for (var s = 0; s < selectors.length; s++) {
                var els = document.querySelectorAll(selectors[s]);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].offsetParent !== null) return els[i];
                }
            }

            // 2. aria-labelやテキストで探す
            var buttons = document.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                if (btn.offsetParent === null) continue;
                var text = btn.textContent.trim();
                var aria = btn.getAttribute('aria-label') || '';
                // 「+」テキスト or 追加系aria-label
                if (text === '+' || text === '＋' ||
                    aria.includes('追加') || aria.includes('add') || aria.includes('ブロック')) {
                    // エディタ内のものだけ（ヘッダーボタンを除外）
                    var rect = btn.getBoundingClientRect();
                    if (rect.width < 60 && rect.height < 60) {
                        return btn;
                    }
                }
            }

            // 3. SVGの「+」アイコンを持つボタン
            var svgButtons = document.querySelectorAll('button svg');
            for (var i = 0; i < svgButtons.length; i++) {
                var svg = svgButtons[i];
                var btn = svg.closest('button');
                if (!btn || btn.offsetParent === null) continue;
                // line要素2本（十字）を持つSVG = "+"アイコン
                var lines = svg.querySelectorAll('line, path');
                if (lines.length >= 2 && lines.length <= 4) {
                    var rect = btn.getBoundingClientRect();
                    if (rect.width < 60) return btn;
                }
            }

            return null;
        """)

        if result:
            log.debug("[+ボタン] 発見")
        else:
            log.debug("[+ボタン] 見つからず")
        return result

    def _upload_file_input(self, image_path: str) -> bool:
        """input[type=file]経由でファイルアップロード"""
        file_inputs = self.driver.find_elements(By.CSS_SELECTOR, 'input[type="file"]')
        for fi in file_inputs:
            try:
                self.driver.execute_script(
                    "arguments[0].style.display='block';"
                    "arguments[0].style.visibility='visible';"
                    "arguments[0].style.height='1px';"
                    "arguments[0].style.width='1px';",
                    fi,
                )
                time.sleep(0.3)
                fi.send_keys(os.path.abspath(image_path))
                log.debug(f"  file input でアップロード: {os.path.basename(image_path)}")
                return True
            except Exception:
                continue
        return False

    def _upload_via_dialog(self, image_path: str) -> bool:
        """pyautoguiでファイルダイアログ操作"""
        if self.headless:
            return False
        try:
            time.sleep(1)
            abs_path = os.path.abspath(image_path)

            # フォルダパス入力
            pyautogui.hotkey("ctrl", "l")
            time.sleep(0.5)
            pyperclip.copy(os.path.dirname(abs_path))
            pyautogui.hotkey("ctrl", "v")
            time.sleep(0.5)
            pyautogui.press("enter")
            time.sleep(1.5)

            # ファイル名入力
            pyperclip.copy(os.path.basename(abs_path))
            pyautogui.hotkey("alt", "n")
            time.sleep(0.3)
            pyautogui.hotkey("ctrl", "a")
            time.sleep(0.1)
            pyautogui.hotkey("ctrl", "v")
            time.sleep(0.3)
            pyautogui.press("enter")
            time.sleep(3)

            log.debug(f"  pyautogui でアップロード: {os.path.basename(image_path)}")
            return True
        except Exception as e:
            log.warning(f"  pyautogui アップロード失敗: {e}")
            return False

    def _dismiss_crop_modal(self):
        """トリミングモーダルを閉じる"""
        modal_btn = self.driver.execute_script("""
            var modal = document.querySelector('.ReactModal__Content');
            if (!modal) return null;
            var buttons = modal.querySelectorAll('button');
            if (buttons.length === 0) return null;
            // 最後のボタン（確定系）をクリック
            return buttons[buttons.length - 1];
        """)
        if modal_btn:
            text = self.driver.execute_script(
                "return arguments[0].textContent.trim();", modal_btn
            )
            log.info(f"[モーダル] トリミング確定: '{text}'")
            self.driver.execute_script("arguments[0].click();", modal_btn)
            time.sleep(10)  # 画像処理待ち

    def _dismiss_any_dialog(self):
        """あらゆるダイアログを閉じる"""
        # 「複数画面で編集」ダイアログ
        result = self.driver.execute_script("""
            var btns = document.querySelectorAll('button');
            for (var i = 0; i < btns.length; i++) {
                var text = (btns[i].textContent || '').trim();
                if (text === '今は保存しない' && btns[i].offsetParent !== null) {
                    return btns[i];
                }
            }
            // 汎用「閉じる」ボタン
            for (var i = 0; i < btns.length; i++) {
                var text = (btns[i].textContent || '').trim();
                if (text === '閉じる' && btns[i].offsetParent !== null) {
                    var parent = btns[i].closest('[role="dialog"], .ReactModal__Content, [class*="modal"]');
                    if (parent) return btns[i];
                }
            }
            return null;
        """)
        if result:
            log.info("[ダイアログ] 閉じます")
            self.driver.execute_script("arguments[0].click();", result)
            time.sleep(2)
            # ReactModalオーバーレイも除去
            self.driver.execute_script("""
                var overlays = document.querySelectorAll('.ReactModal__Overlay');
                overlays.forEach(function(o) { o.remove(); });
            """)
            time.sleep(1)

    def _ensure_text_synced(self, title: str):
        """タイトルがReact stateに反映されているか確認、必要なら再入力"""
        title_el = self.driver.find_element(By.CSS_SELECTOR, 'textarea[placeholder]')
        current = title_el.get_attribute("value") or ""
        if not current.strip():
            log.warning("[同期] タイトルが空。再入力...")
            self._input_title(title)
            time.sleep(0.5)

    def _dump_menu_items(self):
        """現在表示中のメニュー項目をログに出力（デバッグ用）"""
        items = self.driver.execute_script("""
            var result = [];
            var els = document.querySelectorAll(
                'button, [role="menuitem"], [role="option"], li'
            );
            for (var i = 0; i < els.length; i++) {
                if (els[i].offsetParent === null) continue;
                var text = (els[i].textContent || '').trim().substring(0, 40);
                if (text) result.push(text);
            }
            return result;
        """)
        log.info(f"[メニュー項目] {items}")

    def _dump_publish_inputs(self):
        """公開設定画面の全入力要素をログに出力（デバッグ用）"""
        inputs = self.driver.execute_script("""
            var result = [];
            var els = document.querySelectorAll(
                'input, textarea, select, button, [role="switch"], [role="tab"]'
            );
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.offsetParent === null) continue;
                var ctx = el.closest('div, label, section');
                result.push({
                    tag: el.tagName,
                    type: el.getAttribute('type') || '',
                    placeholder: (el.getAttribute('placeholder') || '').substring(0, 30),
                    text: (el.textContent || '').trim().substring(0, 30),
                    context: ((ctx ? ctx.textContent : '') || '').trim().substring(0, 50),
                });
            }
            return result;
        """)
        for inp in inputs:
            log.info(f"  {inp['tag']}[{inp['type']}] placeholder='{inp['placeholder']}' "
                     f"text='{inp['text']}' ctx='{inp['context']}'")

    def _screenshot(self, name: str):
        """デバッグ用スクリーンショット保存"""
        try:
            path = self._screenshot_dir / f"note_post_{name}.png"
            self.driver.save_screenshot(str(path))
            log.debug(f"[SS] {path}")
        except Exception:
            pass

    def close(self):
        """ブラウザを閉じる"""
        if self.driver:
            self.driver.quit()
            log.info("[終了] ブラウザを閉じました")
