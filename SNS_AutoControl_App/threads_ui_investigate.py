"""Threads UI要素の完全調査スクリプト"""
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys


def main():
    options = uc.ChromeOptions()
    options.add_argument('--user-data-dir=C:/Users/ryoya/AppData/Local/Google/Chrome/AutomationProfile_threads')
    options.add_argument('--no-sandbox')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--lang=ja-JP')
    driver = uc.Chrome(options=options, version_main=146)
    driver.implicitly_wait(5)

    try:
        # 1. 投稿作成の全フロー
        print('=' * 60)
        print('1. 投稿作成の全フロー')
        print('=' * 60)
        driver.get('https://www.threads.net')
        time.sleep(8)

        create_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="作成"]')
        if create_svgs:
            create_svgs[0].find_element(By.XPATH, '..').click()
            time.sleep(3)

            # contenteditable
            ce = driver.find_elements(By.CSS_SELECTOR, 'div[contenteditable="true"]')
            print(f'contenteditable: {len(ce)}')
            for c in ce:
                aria = c.get_attribute('aria-label') or ''
                role = c.get_attribute('role') or ''
                print(f'  aria="{aria}" role={role}')

            # role=textbox
            tb = driver.find_elements(By.CSS_SELECTOR, '[role="textbox"]')
            print(f'role=textbox: {len(tb)}')
            for t in tb:
                aria = t.get_attribute('aria-label') or ''
                print(f'  aria="{aria}" tag={t.tag_name}')

            # file input
            fi = driver.find_elements(By.CSS_SELECTOR, 'input[type="file"]')
            print(f'file input: {len(fi)}')
            for f in fi:
                accept = f.get_attribute('accept') or ''
                print(f'  accept={accept}')

            # 添付系ボタン
            attach_labels = ['添付', 'クリップ', 'メディア', '画像', '写真', 'GIF', '投票']
            for label in attach_labels:
                found = driver.find_elements(By.CSS_SELECTOR, f'svg[aria-label*="{label}"]')
                if found:
                    print(f'  {label}ボタン: {len(found)}')

            # ダイアログ内の全ボタン
            print('\n--- ダイアログ内ボタン ---')
            dialog_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"], button')
            for db in dialog_btns:
                text = db.text.strip()[:20]
                aria = db.get_attribute('aria-label') or ''
                if text or aria:
                    print(f'  text="{text}" aria="{aria}"')

            # トピックタグ
            topic = driver.find_elements(By.CSS_SELECTOR, '[aria-label*="トピック"], [aria-label*="タグ"]')
            print(f'\nトピックタグボタン: {len(topic)}')
            # テキストで探す
            for db in dialog_btns:
                text = db.text.strip()
                if 'トピック' in text or 'タグ' in text:
                    print(f'  トピック(text): "{text}"')

            # テキスト入力テスト
            print('\n--- テキスト入力テスト ---')
            target = tb[0] if tb else (ce[0] if ce else None)
            if target:
                try:
                    target.click()
                    time.sleep(0.5)
                    target.send_keys('テスト')
                    time.sleep(1)
                    print(f'  send_keys: OK text="{target.text[:30]}"')
                    target.send_keys(Keys.CONTROL, 'a')
                    target.send_keys(Keys.DELETE)
                except Exception as e:
                    print(f'  send_keys: NG ({e})')

            # 閉じる
            close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
            if close:
                close[0].find_element(By.XPATH, '..').click()
                time.sleep(2)
                # 破棄確認
                discard = driver.find_elements(By.XPATH, '//span[text()="破棄"]/ancestor::div[@role="button"]')
                if discard:
                    print('破棄ダイアログ: あり')
                    discard[0].click()
                    time.sleep(1)
                else:
                    print('破棄ダイアログ: なし')

        # 2. 個別投稿ページ
        print('\n' + '=' * 60)
        print('2. 個別投稿ページ')
        print('=' * 60)
        driver.get('https://www.threads.net')
        time.sleep(5)
        post_links = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/post/"]')
        if post_links:
            post_url = post_links[0].get_attribute('href')
            print(f'投稿URL: {post_url}')
            driver.get(post_url)
            time.sleep(5)

            # いいね数・返信数
            print('\n--- 数値要素 ---')
            btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
            for b in btns:
                text = b.text.strip()
                if text and (text.replace(',', '').isdigit() or '件' in text or 'いいね' in text or '返信' in text):
                    print(f'  "{text}"')

            # span内の数値
            spans = driver.find_elements(By.CSS_SELECTOR, 'span')
            for s in spans:
                text = s.text.strip()
                if text and ('いいね' in text or '返信' in text or '件' in text):
                    print(f'  span: "{text}"')

            # 返信一覧のユーザー
            print('\n--- 返信ユーザー ---')
            reply_users = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/@"]')
            seen = set()
            for ru in reply_users[:10]:
                href = ru.get_attribute('href') or ''
                text = ru.text.strip()[:20]
                if href and '/@' in href and '/post/' not in href and href not in seen:
                    seen.add(href)
                    print(f'  {href} | {text}')

        # 3. プロフィールページ
        print('\n' + '=' * 60)
        print('3. 自分のプロフィール')
        print('=' * 60)
        driver.get('https://www.threads.net/@ando_lyo_ai')
        time.sleep(5)

        # フォロワー数
        btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
        for b in btns:
            text = b.text.strip()
            if 'フォロワー' in text:
                print(f'  フォロワー: "{text}"')

        # 投稿一覧
        my_posts = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/@ando_lyo_ai/post/"]')
        print(f'自分の投稿: {len(my_posts)}')

        # タブ
        print('\n--- タブ ---')
        tabs = driver.find_elements(By.CSS_SELECTOR, 'a')
        for t in tabs:
            text = t.text.strip()[:20]
            href = t.get_attribute('href') or ''
            if text and ('スレッド' in text or 'メディア' in text or '返信' in text or '再投稿' in text):
                print(f'  "{text}" href={href[:60]}')

        # 4. インサイト
        print('\n' + '=' * 60)
        print('4. インサイト')
        print('=' * 60)
        driver.get('https://www.threads.net/insights')
        time.sleep(5)
        print(f'URL: {driver.current_url}')

        # 全テキスト
        spans = driver.find_elements(By.CSS_SELECTOR, 'span, h1, h2, h3')
        for s in spans:
            text = s.text.strip()[:50]
            if text and len(text) > 1:
                tag = s.tag_name
                if any(kw in text for kw in ['閲覧', 'いいね', 'フォロワー', 'インタラクション', '返信', 'リーチ', '%', '件', '人', '合計', '期間', '日', '週']):
                    print(f'  {tag}: "{text}"')

        # タブ
        period_tabs = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"], a')
        for pt in period_tabs:
            text = pt.text.strip()
            if text and ('日' in text or '週' in text or '月' in text or '7' in text or '30' in text or '今日' in text):
                print(f'  期間タブ: "{text}"')

        # 5. 個別投稿のインサイト
        print('\n' + '=' * 60)
        print('5. 個別投稿のインサイト')
        print('=' * 60)
        driver.get('https://www.threads.net/@ando_lyo_ai')
        time.sleep(5)
        my_posts = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/@ando_lyo_ai/post/"]')
        if my_posts:
            driver.get(my_posts[0].get_attribute('href'))
            time.sleep(5)
            # インサイトボタン
            insight_btns = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="インサイト"]')
            print(f'インサイトボタン: {len(insight_btns)}')
            if insight_btns:
                insight_btns[0].find_element(By.XPATH, '..').click()
                time.sleep(3)
                # インサイト内容
                spans = driver.find_elements(By.CSS_SELECTOR, 'span')
                for s in spans:
                    text = s.text.strip()[:50]
                    if text and any(kw in text for kw in ['閲覧', 'いいね', 'インタラクション', '返信', 'ホーム', 'プロフィール', '検索', '%', '合計', '再投稿', '引用']):
                        print(f'  "{text}"')

        # 6. 他ユーザーのプロフィール
        print('\n' + '=' * 60)
        print('6. 他ユーザーのプロフィール')
        print('=' * 60)
        driver.get('https://www.threads.net/@lifestyle_dh_arisa')
        time.sleep(5)
        btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
        for b in btns:
            text = b.text.strip()
            if 'フォロー' in text:
                print(f'  "{text}"')

        # 7. 検索タブ
        print('\n' + '=' * 60)
        print('7. 検索タブ')
        print('=' * 60)
        driver.get('https://www.threads.net/search?q=AI&serp_type=default')
        time.sleep(5)
        links = driver.find_elements(By.CSS_SELECTOR, 'a')
        for l in links:
            text = l.text.strip()[:20]
            href = l.get_attribute('href') or ''
            if 'search' in href and text:
                print(f'  "{text}" href={href[:80]}')

        print('\n完了。2分待機')
        time.sleep(120)

    except Exception as e:
        print(f'\nエラー: {e}')
        import traceback
        traceback.print_exc()
    finally:
        driver.quit()
        print('終了')


if __name__ == '__main__':
    main()
