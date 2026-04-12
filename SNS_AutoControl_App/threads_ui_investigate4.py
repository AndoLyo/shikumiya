"""Threads UI調査 Part4: トピックタグ・返信・いいね（全JSクリック）"""
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys


def js_click(driver, element):
    """JSで強制クリック（intercepted回避）"""
    driver.execute_script('arguments[0].scrollIntoView({block: "center"});', element)
    time.sleep(0.3)
    driver.execute_script('arguments[0].click();', element)


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
        # 1. トピックタグの入力方法
        # ========================================
        print('=' * 60)
        print('1. トピックタグの入力方法')
        print('=' * 60)

        driver.get('https://www.threads.net')
        time.sleep(8)

        # 投稿作成を開く
        text_fields = driver.find_elements(By.CSS_SELECTOR, '[aria-label*="テキストフィールド"]')
        if text_fields:
            js_click(driver, text_fields[0])
            time.sleep(3)
            print('投稿ダイアログ開いた')

            # 「追加」ボタンをJSクリック
            all_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
            for b in all_btns:
                text = b.text.strip()
                if text == '追加':
                    print(f'「追加」ボタン発見')
                    js_click(driver, b)
                    time.sleep(2)

                    # トピック入力UIが出たか
                    print('\n--- トピック入力UI ---')

                    # input要素
                    inputs = driver.find_elements(By.CSS_SELECTOR, 'input')
                    for inp in inputs:
                        ph = inp.get_attribute('placeholder') or ''
                        tp = inp.get_attribute('type') or ''
                        aria = inp.get_attribute('aria-label') or ''
                        if ph or aria:
                            print(f'  input: placeholder="{ph}" type={tp} aria="{aria}"')

                    # contenteditable
                    ce = driver.find_elements(By.CSS_SELECTOR, 'div[contenteditable="true"]')
                    print(f'  contenteditable: {len(ce)}')
                    for c in ce:
                        aria = c.get_attribute('aria-label') or ''
                        print(f'    aria="{aria}"')

                    # 全spanで「トピック」を含むもの
                    spans = driver.find_elements(By.CSS_SELECTOR, 'span')
                    for s in spans:
                        text = s.text.strip()
                        if 'トピック' in text or 'タグ' in text or '検索' in text:
                            print(f'  span: "{text}"')

                    # 全aria-label
                    aria_els = driver.find_elements(By.CSS_SELECTOR, '[aria-label]')
                    for a in aria_els:
                        aria = a.get_attribute('aria-label')
                        if 'トピック' in aria or 'タグ' in aria or 'topic' in aria.lower() or 'tag' in aria.lower():
                            print(f'  aria="{aria}" tag={a.tag_name}')

                    # 全role=textbox
                    tbs = driver.find_elements(By.CSS_SELECTOR, '[role="textbox"]')
                    print(f'  role=textbox: {len(tbs)}')
                    for t in tbs:
                        aria = t.get_attribute('aria-label') or ''
                        print(f'    aria="{aria}"')

                    # 実際にトピックを入力テスト
                    if inputs:
                        for inp in inputs:
                            ph = inp.get_attribute('placeholder') or ''
                            if 'トピック' in ph or '検索' in ph or ph:
                                try:
                                    inp.click()
                                    inp.send_keys('AI画像生成')
                                    time.sleep(2)
                                    print(f'  入力テスト: OK placeholder="{ph}"')

                                    # サジェストが出るか
                                    suggests = driver.find_elements(By.CSS_SELECTOR, 'div[role="option"], div[role="listbox"], ul li')
                                    print(f'  サジェスト: {len(suggests)}')
                                    for sg in suggests[:5]:
                                        print(f'    "{sg.text.strip()[:30]}"')

                                    # クリア
                                    inp.send_keys(Keys.CONTROL, 'a')
                                    inp.send_keys(Keys.DELETE)
                                except Exception as e:
                                    print(f'  入力テスト失敗: {e}')
                                break

                    break

            # 閉じる
            close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
            if close:
                js_click(driver, close[0].find_element(By.XPATH, '..'))
                time.sleep(1)
                discard = driver.find_elements(By.XPATH, '//span[text()="破棄"]/ancestor::div[@role="button"]')
                if discard:
                    js_click(driver, discard[0])
                    time.sleep(1)

        # ========================================
        # 2. 返信の全フロー
        # ========================================
        print('\n' + '=' * 60)
        print('2. 返信の全フロー')
        print('=' * 60)

        driver.get('https://www.threads.net')
        time.sleep(5)

        reply_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="返信"]')
        print(f'返信ボタン: {len(reply_svgs)}')
        if reply_svgs:
            parent = reply_svgs[0].find_element(By.XPATH, '..')
            js_click(driver, parent)
            time.sleep(3)

            print('--- 返信ダイアログ ---')

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

            # p[data-placeholder]
            p_ph = driver.find_elements(By.CSS_SELECTOR, 'p[data-placeholder]')
            print(f'p[data-placeholder]: {len(p_ph)}')
            for p in p_ph:
                ph = p.get_attribute('data-placeholder') or ''
                print(f'  placeholder="{ph}"')

            # テキスト入力テスト
            print('\n--- 返信テキスト入力テスト ---')
            target = tb[0] if tb else (ce[0] if ce else None)
            if target:
                try:
                    js_click(driver, target)
                    time.sleep(0.5)
                    target.send_keys('返信テスト123')
                    time.sleep(1)
                    print(f'  send_keys: OK text="{target.text[:30]}"')

                    # 投稿ボタンの状態
                    post_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
                    for pb in post_btns:
                        text = pb.text.strip()
                        if text == '投稿':
                            print(f'  投稿ボタン: 存在する')
                            break

                    # クリア
                    target.send_keys(Keys.CONTROL, 'a')
                    target.send_keys(Keys.DELETE)
                except Exception as e:
                    print(f'  send_keys: NG ({e})')

            # 閉じる
            close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
            if close:
                js_click(driver, close[0].find_element(By.XPATH, '..'))
                time.sleep(1)
                discard = driver.find_elements(By.XPATH, '//span[text()="破棄"]/ancestor::div[@role="button"]')
                if discard:
                    js_click(driver, discard[0])
                    time.sleep(1)

        # ========================================
        # 3. いいね操作テスト
        # ========================================
        print('\n' + '=' * 60)
        print('3. いいね操作テスト')
        print('=' * 60)

        driver.get('https://www.threads.net')
        time.sleep(5)

        like_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」"]')
        print(f'いいねボタン: {len(like_svgs)}')
        if like_svgs:
            parent = like_svgs[0].find_element(By.XPATH, '..')
            js_click(driver, parent)
            time.sleep(2)

            # いいね後の状態
            unlike = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」を取り消す"]')
            print(f'いいね成功: {len(unlike) > 0}')

            # 取り消し
            if unlike:
                up = unlike[0].find_element(By.XPATH, '..')
                js_click(driver, up)
                time.sleep(1)
                print('いいね取り消し完了')

        # ========================================
        # 4. フォロー操作テスト（確認のみ）
        # ========================================
        print('\n' + '=' * 60)
        print('4. フォロー操作')
        print('=' * 60)

        follow_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="フォローする"]')
        print(f'フォローボタン: {len(follow_svgs)}')
        if follow_svgs:
            parent = follow_svgs[0].find_element(By.XPATH, '..')
            ptag = parent.tag_name
            prole = parent.get_attribute('role') or ''
            print(f'  parent: tag={ptag} role={prole}')
            # フォローは実行しない

        # ========================================
        # 5. 検索→投稿一覧の詳細構造
        # ========================================
        print('\n' + '=' * 60)
        print('5. 検索結果の投稿構造')
        print('=' * 60)

        driver.get('https://www.threads.net/search?q=AI&serp_type=default&filter=recent')
        time.sleep(5)

        # 各投稿のユーザー名+テキスト+いいねボタンの対応
        print('--- 投稿一覧 ---')
        user_links = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/@"]')
        seen = set()
        count = 0
        for ul in user_links:
            href = ul.get_attribute('href') or ''
            text = ul.text.strip()[:20]
            if href and '/@' in href and '/post/' not in href and href not in seen and text:
                seen.add(href)
                print(f'  {href} | {text}')
                count += 1
                if count >= 10:
                    break

        like_count = len(driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」"]'))
        reply_count = len(driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="返信"]'))
        follow_count = len(driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="フォローする"]'))
        print(f'\n検索結果: いいね{like_count} 返信{reply_count} フォロー{follow_count}')

        # ========================================
        # 6. 投稿のペースト入力テスト
        # ========================================
        print('\n' + '=' * 60)
        print('6. ペースト入力テスト')
        print('=' * 60)

        driver.get('https://www.threads.net')
        time.sleep(5)

        text_fields = driver.find_elements(By.CSS_SELECTOR, '[aria-label*="テキストフィールド"]')
        if text_fields:
            js_click(driver, text_fields[0])
            time.sleep(3)

            tb = driver.find_elements(By.CSS_SELECTOR, '[role="textbox"]')
            if tb:
                import pyperclip
                test_text = 'ペーストテスト\n改行も入る\nこれで3行'
                pyperclip.copy(test_text)
                js_click(driver, tb[0])
                time.sleep(0.5)
                tb[0].send_keys(Keys.CONTROL, 'v')
                time.sleep(1)
                result = tb[0].text[:50]
                print(f'  ペースト結果: "{result}"')
                print(f'  改行保持: {"\\n" in result or len(result.split(chr(10))) > 1}')

                # クリア
                tb[0].send_keys(Keys.CONTROL, 'a')
                tb[0].send_keys(Keys.DELETE)

            # 閉じる
            close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
            if close:
                js_click(driver, close[0].find_element(By.XPATH, '..'))
                time.sleep(1)
                discard = driver.find_elements(By.XPATH, '//span[text()="破棄"]/ancestor::div[@role="button"]')
                if discard:
                    js_click(driver, discard[0])
                    time.sleep(1)

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
