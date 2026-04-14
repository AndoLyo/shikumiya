# Threads Selenium操作ガイド（技術スタック）

> 最終更新: 2026-04-14
> 調査環境: threads.net（PCブラウザ）Chrome 146 + undetected-chromedriver
> プロファイル: C:/Users/ryoya/AppData/Local/Google/Chrome/AutomationProfile_threads

## 共通ルール

- **全クリックはJSクリック**（通常クリックはinterceptedエラーが頻発する）
- **scrollIntoViewを先にやる**
- セレクタの基本は `svg[aria-label="XXX"]` の親div

```python
def js_click(driver, element):
    driver.execute_script('arguments[0].scrollIntoView({block: "center"});', element)
    time.sleep(0.3)
    driver.execute_script('arguments[0].click();', element)
```

---

## ナビゲーション

| 画面 | セレクタ | URL |
|---|---|---|
| ホーム | `svg[aria-label="ホーム"]`の親 | threads.net |
| 検索 | `svg[aria-label="検索"]`の親 | threads.net/search |
| 投稿作成 | `svg[aria-label="作成"]`の親 | ダイアログ |
| お知らせ | `svg[aria-label="お知らせ"]`の親 | |
| プロフィール | `svg[aria-label="プロフィール"]`の親 | threads.net/@ando_lyo_ai |
| おすすめタブ | `a[href="/for_you"]` | |
| フォロー中タブ | `a[href="/following"]` | |

---

## 投稿作成

### ダイアログを開く
```python
text_fields = driver.find_elements(By.CSS_SELECTOR, '[aria-label*="テキストフィールド"]')
js_click(driver, text_fields[0])
```

### テキスト入力
```python
tb = driver.find_elements(By.CSS_SELECTOR, '[role="textbox"]')
js_click(driver, tb[0])
tb[0].send_keys('投稿テキスト')
```
- `div[contenteditable="true"]` + `role="textbox"`
- `aria-label="テキストフィールドが空です。テキストを入力して新しい投稿を作成できます。"`
- send_keysで入力OK（動作確認済み）
- ペースト（Ctrl+V）は要追加検証（Part4で空になった）

### 画像添付
```python
file_inputs = driver.find_elements(By.CSS_SELECTOR, 'input[type="file"]')
file_inputs[0].send_keys(str(Path(image_path).resolve()))
```
- accept: image/avif,image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm
- 関連ボタン: `svg[aria-label="メディアを添付"]`, `svg[aria-label="GIFを追加"]`

### トピックタグ
```python
# 「追加」ボタンをクリック
all_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
for b in all_btns:
    if b.text.strip() == '追加':
        js_click(driver, b)
        break

# トピック入力欄
topic_input = driver.find_element(By.CSS_SELECTOR, 'input[placeholder="トピックを追加"]')
driver.execute_script('arguments[0].click();', topic_input)  # JSクリック必須
topic_input.send_keys('AI画像生成')
```
- type="search"
- サジェストが出る可能性あり → 選択するか、そのまま確定

### 投稿ボタン
```python
post_btns = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
for pb in post_btns:
    if pb.text.strip() == '投稿':
        js_click(driver, pb)
        break
```

### 閉じる→破棄
```python
close = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="閉じる"]')
js_click(driver, close[0].find_element(By.XPATH, '..'))
time.sleep(1)
discard = driver.find_elements(By.XPATH, '//span[text()="破棄"]/ancestor::div[@role="button"]')
if discard:
    js_click(driver, discard[0])
```

---

## いいね

### いいねする
```python
like_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」"]')
parent = like_svgs[0].find_element(By.XPATH, '..')
js_click(driver, parent)
```
**動作確認済み ✅**

### いいね取り消し
```python
unlike_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」を取り消す"]')
parent = unlike_svgs[0].find_element(By.XPATH, '..')
js_click(driver, parent)
```
**動作確認済み ✅**

### いいね済み判定
- `svg[aria-label="「いいね！」"]` → 未いいね
- `svg[aria-label="「いいね！」を取り消す"]` → いいね済み

---

## 返信

### 返信ダイアログを開く
```python
reply_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="返信"]')
parent = reply_svgs[0].find_element(By.XPATH, '..')
js_click(driver, parent)
```

### テキスト入力
```python
tb = driver.find_elements(By.CSS_SELECTOR, '[role="textbox"]')
js_click(driver, tb[0])
tb[0].send_keys('返信テキスト')
```
- 投稿作成と同じセレクタ（`div[contenteditable="true"]` + `role="textbox"`）
- send_keysで入力OK（動作確認済み）

### 投稿ボタン
```python
# 投稿作成と同じ
for pb in driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]'):
    if pb.text.strip() == '投稿':
        js_click(driver, pb)
        break
```

---

## フォロー

### フォローする
```python
follow_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="フォローする"]')
parent = follow_svgs[0].find_element(By.XPATH, '..')
js_click(driver, parent)
```
- ホームのフィード内にもフォローボタンが表示される（4件確認）
- 他ユーザーのプロフィールページでは `div[role="button"]` text="フォローする"

### フォロー済み判定
- `svg[aria-label="フォローする"]` → 未フォロー
- フォロー済みの場合のaria-labelは未調査（「フォロー中」等の可能性）

---

## 再投稿（リポスト）

```python
repost_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="再投稿"]')
parent = repost_svgs[0].find_element(By.XPATH, '..')
js_click(driver, parent)
```
- クリック後に確認ダイアログが出る可能性あり（未調査）

---

## シェア

```python
share_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="シェアする"]')
parent = share_svgs[0].find_element(By.XPATH, '..')
js_click(driver, parent)
```

---

## 検索

### 検索実行
```python
# 直接URLでアクセスする方が安定
driver.get('https://www.threads.net/search?q=AI&serp_type=default&filter=recent')
```

### URL構造
| タブ | URL |
|---|---|
| 上位検索結果 | `?q=キーワード&serp_type=default` |
| 最近 | `?q=キーワード&serp_type=default&filter=recent` |
| タグ検索 | `?q=キーワード&serp_type=tags&tag_id=XXX` |

### 入力欄で検索
```python
search_input = driver.find_element(By.CSS_SELECTOR, 'input[placeholder="検索"]')
search_input.click()
search_input.send_keys('AI画像生成')
search_input.send_keys(Keys.ENTER)
```

### 検索結果の投稿
- 各投稿にいいね・返信・フォローボタンが対応
- ユーザーリンク: `a[href*="/@"]`（`/post/`を除外でユーザー名のみ）
- 投稿リンク: `a[href*="/post/"]`

---

## インサイト（自分の投稿のみ）

### アクセス方法
「…」メニュー → 「インサイト」の2段階。

```python
# 1. 投稿ページで「もっと見る」ボタンを探す
more_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="もっと見る"]')

# 2. 各ボタンを試してインサイトがあるメニューを探す
for i, svg in enumerate(more_svgs):
    parent = svg.find_element(By.XPATH, '..')
    js_click(driver, parent)
    time.sleep(2)
    
    menu_items = driver.find_elements(By.CSS_SELECTOR, 'div[role="menuitem"]')
    menu_texts = [mi.text.strip() for mi in menu_items]
    
    if 'インサイト' in menu_texts:
        # インサイトをクリック
        for mi in menu_items:
            if mi.text.strip() == 'インサイト':
                mi.click()
                time.sleep(3)
                break
        break
    else:
        # このメニューは違う → 閉じる
        driver.execute_script('document.body.click();')
        time.sleep(1)
```

### 自分の投稿メニュー項目
- 列として追加
- **インサイト**
- 保存
- プロフィールにピン留め
- 「いいね！」数とシェア数を非表示
- 返信オプション
- 削除する
- リンクをコピー

### 他人の投稿メニュー項目
- 保存済み
- 「いいね！」済み
- 問題を報告
（インサイトはない）

### インサイトデータの取得
```python
# ダイアログ内のspanからデータ取得
spans = driver.find_elements(By.CSS_SELECTOR, 'span')
data = {}
prev_label = ''
for s in spans:
    text = s.text.strip()
    if text in ['閲覧', 'ホーム', 'インタラクション', '「いいね！」', '引用', '返信', '再投稿', 'フォロー']:
        prev_label = text
    elif text and prev_label and (text.replace(',', '').replace('.', '').replace('%', '').isdigit()):
        data[prev_label] = text
        prev_label = ''
```

### 取得可能データ
| フィールド | ラベル | 例 |
|---|---|---|
| 閲覧数 | 「閲覧」→ 「合計閲覧数」の上の数字 | 167 |
| ホーム% | 「ホーム」の横 | 100.0% |
| プロフィール% | 「プロフィール」の横 | 0.3% |
| 検索% | 「検索」の横 | 0.9% |
| その他% | 「その他」の横 | 1.1% |
| インタラクション数 | 「合計インタラクション数」の上の数字 | 0 |
| いいね数 | 「いいね！」の横 | 0 |
| 引用数 | 「引用」の横 | 0 |
| 返信数 | 「返信」の横 | 0 |
| 再投稿数 | 「再投稿」の横 | 0 |
| フォロー数 | 「フォロー」の横 | 0 |

### アカウントインサイト
- URL: `https://www.threads.net/insights`
- **フォロワー100人未満は閲覧不可**（「フォロワーが100人に達すると、インサイトを確認できるようになります」）
- 期間: 過去30日等

---

## プロフィールページ

### 自分のプロフィール
| 要素 | セレクタ |
|---|---|
| URL | `https://www.threads.net/@ando_lyo_ai` |
| フォロワー数 | `div[role="button"]` text="フォロワーXX人" |
| 編集ボタン | `div[role="button"]` text="プロフィールを編集" |
| タブ: スレッド | `a[href="/@ando_lyo_ai"]` |
| タブ: 返信 | `a[href="/@ando_lyo_ai/replies"]` |
| タブ: メディア | `a[href="/@ando_lyo_ai/media"]` |
| タブ: 再投稿 | `a[href="/@ando_lyo_ai/reposts"]` |
| 投稿一覧 | `a[href*="/@ando_lyo_ai/post/"]` |

### 他ユーザーのプロフィール
| 要素 | セレクタ |
|---|---|
| フォローボタン | `div[role="button"]` text="フォローする" |
| フォロワー数 | `div[role="button"]` text="フォロワーXX人" |

---

## 投稿一覧の構造（ホーム・検索結果共通）

### 投稿者情報
```python
user_links = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/@"]')
# /post/ を含むものは投稿リンク、含まないものがユーザーリンク
for ul in user_links:
    href = ul.get_attribute('href')
    if '/post/' not in href:
        username = href.split('/@')[-1]
```

### 投稿テキスト
```python
spans = driver.find_elements(By.CSS_SELECTOR, 'span[dir="auto"]')
# テキストが10文字以上のものが投稿本文
```

### 各投稿のアクションボタン
投稿ごとに以下のボタンが1セット:
- `svg[aria-label="「いいね！」"]` — いいね
- `svg[aria-label="返信"]` — 返信
- `svg[aria-label="再投稿"]` — 再投稿
- `svg[aria-label="シェアする"]` — シェア
- `svg[aria-label="もっと見る"]` — メニュー
- `svg[aria-label="フォローする"]` — フォロー（フィード内に表示される場合）

### N番目の投稿に対してアクション
```python
# いいねボタンのindex = 投稿のindex
like_svgs = driver.find_elements(By.CSS_SELECTOR, 'svg[aria-label="「いいね！」"]')
# like_svgs[0] = 1番目の投稿のいいね
# like_svgs[1] = 2番目の投稿のいいね
```

---

## 注意事項

- Threadsのドメインは `threads.net` だが、リダイレクトで `threads.com` になることがある
- PCブラウザとモバイルアプリでUIが異なる部分がある
- 投稿作成のcontenteditable要素は、DOMにテキストが入っていても`.text`で空文字が返ることがある
- メニュー（role=menuitem）は`div[role="button"]`ではなく`div[role="menuitem"]`
- 「もっと見る」ボタンはナビ・投稿・設定など複数箇所にある。投稿のものはindex[3]付近（ページ構造による）
