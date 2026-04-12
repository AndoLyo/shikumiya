"""Threads UI調査 Part2: メニュー・インサイト・投稿入力の詳細"""
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
        # 1. 投稿の「…」メニューとインサイト
        # ========================================
        print('=' * 60)
        print('1. 投稿の「…」メニューとインサイト')
        print('=' * 60)

        # 自分の投稿ページに移動
        driver.get('https://www.threads.net/@ando_lyo_ai')
        time.sleep(5)

        # 自分の投稿を1つ開く
        my_posts = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/@ando_lyo_ai/post/"]')
        if my_posts:
            driver.get(my_posts[0].get_attribute('href'))
            time.sleep(5)
            print(f'投稿URL: {driver.current_url}')

            # 「…」メニューボタンを探す
            print('\n--- 「…」メニューボタン ---')
            # aria-label="もっと見る" か "More" を探す
            more_btns = driver.find_elements(By.CSS_SELECTOR,
                'svg[aria-label="もっと見る"], svg[aria-label="More"], '
                'div[aria-label="もっと見る"], button[aria-label="もっと見る"]')
            print(f'  「もっと見る」: {len(more_btns)}')

            # role=button の ... を探す
            all_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
            for b in all_btns:
                aria = b.get_attribute('aria-label') or ''
                text = b.text.strip()[:10]
                if 'もっと' in aria or 'more' in aria.lower() or text == '…' or text == '...':
                    print(f'  候補: aria="{aria}" text="{text}" tag={b.tag_name}')

            # svg全部から探す
            all_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg')
            for s in all_svgs:
                aria = s.get_attribute('aria-label') or ''
                if 'もっと' in aria or 'more' in aria.lower() or 'その他' in aria or 'メニュー' in aria:
                    parent = s.find_element(By.XPATH, '..')
                    ptag = parent.tag_name
                    prole = parent.get_attribute('role') or ''
                    print(f'  SVG: aria="{aria}" parent={ptag} role={prole}')

            # data-testid で探す
            testid_els = driver.find_elements(By.CSS_SELECTOR, '[data-testid*="menu"], [data-testid*="more"], [data-testid*="option"]')
            for te in testid_els:
                print(f'  testid: {te.get_attribute("data-testid")} tag={te.tag_name}')

            # 全クリック可能要素でaria-labelがあるもの
            print('\n--- 全aria-label付き要素（投稿ページ） ---')
            all_aria = driver.find_elements(By.CSS_SELECTOR, '[aria-label]')
            seen = set()
            for a in all_aria:
                aria = a.get_attribute('aria-label')
                tag = a.tag_name
                key = f'{aria}|{tag}'
                if key not in seen and aria:
                    seen.add(key)
                    print(f'  {tag}: "{aria}"')

            # 「…」をクリックしてメニューを開く
            # まず最初のmore_btnsで試す
            print('\n--- メニューを開く ---')
            clicked = False
            for mb in more_btns:
                try:
                    parent = mb.find_element(By.XPATH, '..')
                    parent.click()
                    time.sleep(2)
                    clicked = True
                    print('  クリック成功')
                    break
                except Exception as e:
                    print(f'  クリック失敗: {e}')

            if not clicked:
                # aria-label="もっと見る"のdivを探す
                more_divs = driver.find_elements(By.CSS_SELECTOR, '[aria-label="もっと見る"]')
                for md in more_divs:
                    try:
                        md.click()
                        time.sleep(2)
                        clicked = True
                        print('  div直接クリック成功')
                        break
                    except:
                        pass

            if clicked:
                # メニュー内の全項目
                print('\n--- メニュー項目 ---')
                menu_items = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"], div[role="menuitem"], a')
                for mi in menu_items:
                    text = mi.text.strip()[:30]
                    aria = mi.get_attribute('aria-label') or ''
                    role = mi.get_attribute('role') or ''
                    if text and ('インサイト' in text or '保存' in text or 'ピン' in text or
                               '削除' in text or 'リンク' in text or '返信' in text or
                               'いいね' in text or 'シェア' in text or '非表示' in text or
                               'ブロック' in text or 'ミュート' in text or '報告' in text):
                        print(f'  "{text}" role={role} aria="{aria}"')

                # インサイトをクリック
                print('\n--- インサイトをクリック ---')
                insight_items = driver.find_elements(By.XPATH,
                    '//span[text()="インサイト"]/ancestor::div[@role="button"] | '
                    '//div[text()="インサイト"]')
                print(f'  インサイト要素: {len(insight_items)}')
                if insight_items:
                    try:
                        insight_items[0].click()
                        time.sleep(3)
                        print('  インサイトダイアログ開いた')

                        # インサイトダイアログの全内容
                        print('\n--- インサイトダイアログ ---')
                        all_spans = driver.find_elements(By.CSS_SELECTOR, 'span')
                        for s in all_spans:
                            text = s.text.strip()[:60]
                            if text and len(text) > 0:
                                if any(kw in text for kw in [
                                    '閲覧', '合計', 'ホーム', 'プロフィール', '検索', 'その他',
                                    'インタラクション', 'いいね', '引用', '返信', '再投稿',
                                    'フォロー', '%', '投稿インサイト'
                                ]):
                                    print(f'  span: "{text}"')

                        # 数値の取得
                        print('\n--- 数値要素 ---')
                        all_text = driver.find_elements(By.CSS_SELECTOR, 'span, div')
                        for t in all_text:
                            text = t.text.strip()
                            if text and text.replace(',', '').replace('.', '').replace('%', '').isdigit():
                                parent_text = ''
                                try:
                                    parent_text = t.find_element(By.XPATH, '..').text.strip()[:30]
                                except:
                                    pass
                                if len(text) < 10:
                                    print(f'  "{text}" (parent: "{parent_text}")')

                        # 閉じる
                        close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
                        if close:
                            close[0].find_element(By.XPATH, '..').click()
                            time.sleep(1)
                    except Exception as e:
                        print(f'  インサイトクリック失敗: {e}')

        # ========================================
        # 2. 投稿作成のテキスト入力方法
        # ========================================
        print('\n' + '=' * 60)
        print('2. 投稿作成のテキスト入力方法')
        print('=' * 60)
        driver.get('https://www.threads.net')
        time.sleep(5)

        # 「今なにしてる？」のテキストフィールドを直接クリック
        text_fields = driver.find_elements(By.CSS_SELECTOR,
            '[aria-label*="テキストフィールド"]')
        print(f'テキストフィールド: {len(text_fields)}')

        if text_fields:
            text_fields[0].click()
            time.sleep(3)

            # ダイアログが開いた後の入力欄を再取得
            print('\n--- ダイアログ開いた後 ---')
            p_elements = driver.find_elements(By.CSS_SELECTOR, 'p[data-placeholder]')
            print(f'p[data-placeholder]: {len(p_elements)}')
            for p in p_elements:
                ph = p.get_attribute('data-placeholder') or ''
                ce = p.get_attribute('contenteditable') or ''
                print(f'  placeholder="{ph}" contenteditable={ce}')

            # div[contenteditable] を再検索
            ce_divs = driver.find_elements(By.CSS_SELECTOR, 'div[contenteditable="true"]')
            print(f'contenteditable divs: {len(ce_divs)}')
            for cd in ce_divs:
                aria = cd.get_attribute('aria-label') or ''
                role = cd.get_attribute('role') or ''
                print(f'  aria="{aria}" role={role}')

            # 全p要素
            all_p = driver.find_elements(By.CSS_SELECTOR, 'p')
            for p in all_p:
                ph = p.get_attribute('data-placeholder') or ''
                if ph:
                    print(f'  p with placeholder: "{ph}"')

            # 実際にテキスト入力テスト
            print('\n--- テキスト入力テスト ---')
            # p[data-placeholder]に入力
            if p_elements:
                try:
                    p_elements[0].click()
                    time.sleep(0.5)
                    p_elements[0].send_keys('テスト入力123')
                    time.sleep(1)
                    print(f'  p要素send_keys: OK text="{p_elements[0].text[:30]}"')
                except Exception as e:
                    print(f'  p要素send_keys: NG ({e})')

            # contenteditable divに入力
            if ce_divs:
                try:
                    ce_divs[0].click()
                    time.sleep(0.5)
                    ce_divs[0].send_keys('テスト入力456')
                    time.sleep(1)
                    print(f'  ce div send_keys: OK text="{ce_divs[0].text[:30]}"')
                except Exception as e:
                    print(f'  ce div send_keys: NG ({e})')

            # トピックタグ追加ボタン
            print('\n--- トピックタグ ---')
            all_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
            for b in all_btns:
                text = b.text.strip()[:20]
                if 'トピック' in text or 'タグ' in text or '追加' in text:
                    print(f'  "{text}"')

            # # をテキストに入力した時の挙動
            # 画像添付ボタンを探す
            print('\n--- 画像添付 ---')
            all_aria = driver.find_elements(By.CSS_SELECTOR, '[aria-label]')
            for a in all_aria:
                aria = a.get_attribute('aria-label') or ''
                if any(kw in aria for kw in ['添付', 'クリップ', '画像', '写真', 'メディア', 'GIF', '動画', 'カメラ', 'ファイル']):
                    print(f'  aria="{aria}" tag={a.tag_name}')

            file_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[type="file"]')
            print(f'  file input: {len(file_inputs)}')
            for fi in file_inputs:
                accept = fi.get_attribute('accept') or ''
                print(f'    accept={accept}')

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
        # 3. 他ユーザーの投稿でメニュー確認
        # ========================================
        print('\n' + '=' * 60)
        print('3. 他ユーザーの投稿メニュー')
        print('=' * 60)
        driver.get('https://www.threads.net')
        time.sleep(5)

        # 他人の投稿のメニューボタン
        more_btns = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="もっと見る"]')
        print(f'「もっと見る」ボタン: {len(more_btns)}')
        if len(more_btns) > 1:
            # 2番目（他人の投稿）のメニューを開く
            try:
                more_btns[1].find_element(By.XPATH, '..').click()
                time.sleep(2)
                print('\n--- 他人の投稿メニュー ---')
                menu_items = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
                for mi in menu_items:
                    text = mi.text.strip()[:30]
                    if text and len(text) > 1 and len(text) < 20:
                        print(f'  "{text}"')
                # 閉じる（メニュー外クリック）
                driver.find_element(By.CSS_SELECTOR, 'body').click()
                time.sleep(1)
            except Exception as e:
                print(f'  失敗: {e}')

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
