"""Threads UI調査 Part3: 自分の投稿インサイト・トピックタグ・返信入力"""
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
        # ========================================
        # 1. 自分の投稿でインサイトを正しく開く
        # ========================================
        print('=' * 60)
        print('1. 自分の投稿でインサイトを開く')
        print('=' * 60)

        driver.get('https://www.threads.net/@ando_lyo_ai')
        time.sleep(5)

        # 自分の最新投稿を開く
        my_posts = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/@ando_lyo_ai/post/"]')
        if my_posts:
            post_url = my_posts[0].get_attribute('href')
            driver.get(post_url)
            time.sleep(5)
            print(f'投稿URL: {post_url}')

            # 「もっと見る」ボタンをscrollIntoView + JSクリック
            more_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="もっと見る"]')
            print(f'「もっと見る」SVG: {len(more_svgs)}')

            # 投稿に紐づく「もっと見る」を特定するため、投稿テキスト周辺のものを探す
            for i, svg in enumerate(more_svgs):
                try:
                    driver.execute_script('arguments[0].scrollIntoView({block: "center"});', svg)
                    time.sleep(0.5)
                    parent = svg.find_element(By.XPATH, '..')
                    driver.execute_script('arguments[0].click();', parent)
                    time.sleep(2)

                    # メニューが開いたか確認
                    menu_items = driver.find_elements(By.CSS_SELECTOR, 'div[role="menuitem"]')
                    menu_texts = [mi.text.strip() for mi in menu_items if mi.text.strip()]
                    print(f'  メニュー[{i}]: {menu_texts}')

                    if 'インサイト' in menu_texts:
                        print(f'  → インサイト発見！ index={i}')

                        # インサイトをクリック
                        for mi in menu_items:
                            if mi.text.strip() == 'インサイト':
                                mi.click()
                                time.sleep(3)
                                print('  インサイトダイアログ開いた')

                                # ダイアログの全内容を取得
                                print('\n--- インサイトダイアログ全内容 ---')
                                dialog_spans = driver.find_elements(By.CSS_SELECTOR, 'span')
                                for s in dialog_spans:
                                    text = s.text.strip()
                                    if text and len(text) < 60 and len(text) > 0:
                                        print(f'  "{text}"')

                                # 閉じる
                                close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
                                if close:
                                    close[0].find_element(By.XPATH, '..').click()
                                    time.sleep(1)
                                break
                        break
                    else:
                        # このメニューはインサイトがない（他人の投稿 or ナビ）
                        # メニュー外クリックで閉じる
                        driver.execute_script('document.body.click();')
                        time.sleep(1)
                except Exception as e:
                    print(f'  メニュー[{i}]エラー: {str(e)[:80]}')

        # ========================================
        # 2. トピックタグの入力方法
        # ========================================
        print('\n' + '=' * 60)
        print('2. トピックタグの入力方法')
        print('=' * 60)

        driver.get('https://www.threads.net')
        time.sleep(5)

        # 投稿作成を開く
        text_fields = driver.find_elements(By.CSS_SELECTOR, '[aria-label*="テキストフィールド"]')
        if text_fields:
            text_fields[0].click()
            time.sleep(3)

            # 「追加」ボタンを探す（トピックタグ用）
            all_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
            for b in all_btns:
                text = b.text.strip()
                if text == '追加':
                    print(f'「追加」ボタン発見')
                    try:
                        driver.execute_script('arguments[0].scrollIntoView({block: "center"});', b)
                        time.sleep(0.5)
                        b.click()
                        time.sleep(2)

                        # トピック入力UIが出たか
                        print('\n--- トピック入力UI ---')
                        # input
                        inputs = driver.find_elements(By.CSS_SELECTOR, 'input')
                        for inp in inputs:
                            ph = inp.get_attribute('placeholder') or ''
                            tp = inp.get_attribute('type') or ''
                            print(f'  input: placeholder="{ph}" type={tp}')

                        # contenteditable
                        ce = driver.find_elements(By.CSS_SELECTOR, 'div[contenteditable="true"]')
                        print(f'  contenteditable: {len(ce)}')

                        # 全aria-label
                        aria_els = driver.find_elements(By.CSS_SELECTOR, '[aria-label]')
                        for a in aria_els:
                            aria = a.get_attribute('aria-label')
                            if 'トピック' in aria or 'タグ' in aria or 'topic' in aria.lower():
                                print(f'  aria="{aria}" tag={a.tag_name}')

                        # テキストで「トピック」を含む要素
                        spans = driver.find_elements(By.CSS_SELECTOR, 'span')
                        for s in spans:
                            text = s.text.strip()
                            if 'トピック' in text or 'タグ' in text:
                                print(f'  span: "{text}"')

                    except Exception as e:
                        print(f'  エラー: {e}')
                    break

            # 閉じる
            close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
            if close:
                close[0].find_element(By.XPATH, '..').click()
                time.sleep(1)
                discard = driver.find_elements(By.XPATH, '//span[text()="破棄"]/ancestor::div[@role="button"]')
                if discard:
                    discard[0].click()
                    time.sleep(1)

        # ========================================
        # 3. 返信の全フロー
        # ========================================
        print('\n' + '=' * 60)
        print('3. 返信の全フロー')
        print('=' * 60)

        driver.get('https://www.threads.net')
        time.sleep(5)

        # 最初の投稿の返信ボタンをクリック
        reply_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="返信"]')
        if reply_svgs:
            driver.execute_script('arguments[0].scrollIntoView({block: "center"});', reply_svgs[0])
            time.sleep(0.5)
            reply_svgs[0].find_element(By.XPATH, '..').click()
            time.sleep(3)

            print('--- 返信ダイアログ ---')

            # contenteditable
            ce = driver.find_elements(By.CSS_SELECTOR, 'div[contenteditable="true"]')
            print(f'contenteditable: {len(ce)}')
            for c in ce:
                aria = c.get_attribute('aria-label') or ''
                role = c.get_attribute('role') or ''
                print(f'  aria="{aria}" role={role}')

            # p[data-placeholder]
            p_ph = driver.find_elements(By.CSS_SELECTOR, 'p[data-placeholder]')
            print(f'p[data-placeholder]: {len(p_ph)}')
            for p in p_ph:
                ph = p.get_attribute('data-placeholder') or ''
                print(f'  placeholder="{ph}"')

            # テキスト入力テスト
            print('\n--- 返信テキスト入力テスト ---')
            # role=textbox を探す
            tb = driver.find_elements(By.CSS_SELECTOR, '[role="textbox"]')
            print(f'role=textbox: {len(tb)}')
            target = tb[0] if tb else (ce[0] if ce else None)
            if target:
                try:
                    target.click()
                    time.sleep(0.5)
                    target.send_keys('返信テスト123')
                    time.sleep(1)
                    print(f'  send_keys: OK text="{target.text[:30]}"')

                    # 投稿ボタン
                    post_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
                    for pb in post_btns:
                        text = pb.text.strip()
                        if text == '投稿':
                            enabled = pb.is_enabled()
                            displayed = pb.is_displayed()
                            print(f'  投稿ボタン: enabled={enabled} displayed={displayed}')
                            break

                    # クリアして閉じる
                    target.send_keys(Keys.CONTROL, 'a')
                    target.send_keys(Keys.DELETE)
                except Exception as e:
                    print(f'  send_keys: NG ({e})')

            # 閉じる
            close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
            if close:
                close[0].find_element(By.XPATH, '..').click()
                time.sleep(1)
                discard = driver.find_elements(By.XPATH, '//span[text()="破棄"]/ancestor::div[@role="button"]')
                if discard:
                    discard[0].click()
                    time.sleep(1)

        # ========================================
        # 4. いいねの実際の操作テスト
        # ========================================
        print('\n' + '=' * 60)
        print('4. いいね操作テスト')
        print('=' * 60)

        driver.get('https://www.threads.net')
        time.sleep(5)

        like_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」"]')
        print(f'いいねボタン: {len(like_svgs)}')
        if like_svgs:
            # 最初のいいねボタンの親をJSクリック
            parent = like_svgs[0].find_element(By.XPATH, '..')
            driver.execute_script('arguments[0].scrollIntoView({block: "center"});', parent)
            time.sleep(0.5)
            driver.execute_script('arguments[0].click();', parent)
            time.sleep(2)

            # いいね後の状態確認
            unlike = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」を取り消す"]')
            print(f'いいね取り消しボタン（いいね成功の証拠）: {len(unlike)}')

            # 取り消し（元に戻す）
            if unlike:
                up = unlike[0].find_element(By.XPATH, '..')
                driver.execute_script('arguments[0].click();', up)
                time.sleep(1)
                print('  いいね取り消し完了')

        # ========================================
        # 5. フォロー操作テスト
        # ========================================
        print('\n' + '=' * 60)
        print('5. フォロー操作（確認のみ）')
        print('=' * 60)

        follow_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="フォローする"]')
        print(f'フォローボタン: {len(follow_svgs)}')
        if follow_svgs:
            parent = follow_svgs[0].find_element(By.XPATH, '..')
            print(f'  parent: tag={parent.tag_name} role={parent.get_attribute("role")}')
            # フォローは実行しない（テストなので）

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
