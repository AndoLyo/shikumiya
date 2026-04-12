# Cookie同意バナー
> ID: cookie-consent | カテゴリ: parts | プラン: middle

## 概要
サイト訪問者に対して Cookie の利用について同意を求めるバナー。画面下部に固定表示し、承認・拒否・詳細設定の選択肢を提供する。日本の個人情報保護法・改正電気通信事業法、および海外顧客がいる場合は GDPR への準拠を考慮した文言とカテゴリ分類を実装する。業種を問わず、Google Analytics によるアクセス解析やリマーケティング広告のトラッキングを行うサイトで必要なパーツ。既存3テンプレートには未実装のため、新規コンポーネントとして追加する。localStorage でユーザーの選択を永続化し、再訪時にバナーを非表示にする。

## この機能の核
邪魔にならずに消えて、サイト閲覧を妨げない

## 必須要件
- 画面下部に `fixed bottom-0` で固定表示（`z-40` 以上、ヘッダーの `z-50` より下）
- 3つのアクション: 「すべて許可」「必要最低限のみ」「詳細設定」
- Cookie カテゴリ: 必須（常時有効）/ 分析（Google Analytics 等）/ マーケティング（広告トラッキング）
- `localStorage` にユーザーの同意状態を保存（キー: `cookie-consent`）
- 再訪時に `localStorage` を確認し、同意済みならバナー非表示
- 詳細設定モーダル: カテゴリごとのトグルスイッチ
- プライバシーポリシーへのリンクを表示
- `prefers-reduced-motion` 対応（表示アニメーション）
- 初回表示は `AnimatePresence` でスライドアップ表示

## 業種別バリエーション

### 建築・建設
Cookie 用途: Google Analytics / リスティング広告のリマーケティング / 来場予約フォームのセッション管理
文言例: 「当サイトでは、お客様の利便性向上とサービス改善のためにCookieを使用しています。」

### 小売・EC
Cookie 用途: Google Analytics / 広告トラッキング / カート情報保持 / レコメンドエンジン
文言例: 「当サイトでは、お買い物体験の向上とマーケティングのためにCookieを使用しています。」
注意: カート機能の Cookie は「必須」カテゴリに含める

### 飲食
Cookie 用途: Google Analytics / 予約システムのセッション / SNS 広告トラッキング
文言例: 「当サイトでは、お客様へのサービス向上のためにCookieを使用しています。」

### 美容・サロン
Cookie 用途: Google Analytics / HotPepper 予約連携 / LINE 広告トラッキング
文言例: 「当サイトでは、サービス改善と最適な情報提供のためにCookieを使用しています。」

### 医療・クリニック
Cookie 用途: Google Analytics / Web 予約システムのセッション
文言例: 「当サイトでは、利便性向上のためにCookieを使用しています。個人の健康情報はCookieに保存されません。」
注意: 医療情報は Cookie に含まれないことを明記

### 士業・コンサルティング
Cookie 用途: Google Analytics / 問い合わせフォームのセッション
文言例: 「当サイトでは、サービス向上のためにCookieを使用しています。」

## 既存テンプレートとの接続

### warm-craft（暖色ナチュラル系）
- **現状**: Cookie バナー未実装
- **配置**: `<Footer />` の後、`</main>` の外に追加
- **z-index**: `z-40`（ヘッダー `z-50` の下、SP固定底部電話バー `z-40` と同レベル — 電話バーがある場合は `bottom-16` にオフセット）
- **スタイル指針**: `bg-[#FAF7F2] border-t border-[#E8DFD3]`（背景）/ `bg-[#7BA23F]`（許可ボタン）/ `text-[#3D3226]`（テキスト）/ `rounded-lg`（ボタン角丸）

### trust-navy（ネイビー重厚系）
- **現状**: Cookie バナー未実装
- **配置**: `<Footer />` の後に追加
- **スタイル指針**: `bg-white border-t border-gray-200`（背景）/ `bg-[#1B3A5C]`（許可ボタン）/ `text-gray-700`（テキスト）/ 角丸なし（直角ベース）

### clean-arch（ミニマルモノクロ系）
- **現状**: Cookie バナー未実装
- **配置**: `<Footer />` の後に追加
- **スタイル指針**: `bg-white border-t border-gray-100`（背景）/ `bg-gray-800`（許可ボタン）/ `text-gray-600`（テキスト）/ `text-xs tracking-wider`（ミニマルフォント）

### 全テンプレート共通
- ページコンポーネント（`WarmCraftPage` / `TrustNavyPage` 等）のルート `<>` 内に `<CookieConsent />` を追加
- warm-craft の SP固定底部電話バーとの干渉を避けるため、`md:bottom-0 bottom-16` でレスポンシブに位置調整

## コンポーネント仕様

### ファイル配置
```
src/components/portfolio-templates/common/CookieConsent.tsx
  ※ 全テンプレートで共通利用（色のみ Props で変更）
```

### Props / データ構造
```typescript
interface CookieCategory {
  id: string;              // "analytics" | "marketing"
  label: string;           // "分析Cookie"
  description: string;     // "Google Analyticsによるアクセス解析に使用"
  required: boolean;       // true = 必須（トグル無効）、false = 任意
  defaultEnabled: boolean;
}

interface CookieConsentConfig {
  storageKey: string;      // "cookie-consent"
  categories: CookieCategory[];
  message: string;         // バナーの説明文
  privacyPolicyUrl: string; // "/privacy"
  theme: {
    background: string;    // "bg-[#FAF7F2]"
    borderColor: string;   // "border-[#E8DFD3]"
    textColor: string;     // "text-[#3D3226]"
    acceptButtonBg: string; // "bg-[#7BA23F]"
    acceptButtonText: string; // "text-white"
    declineButtonBg: string;  // "bg-transparent"
    declineButtonText: string; // "text-[#8B7D6B]"
  };
  mobileBottomOffset?: string;  // "bottom-16"（SP固定バーとの干渉回避）
}

interface ConsentState {
  accepted: boolean;
  categories: Record<string, boolean>;  // { analytics: true, marketing: false }
  timestamp: string;       // ISO 8601
}
```

### 状態管理
```typescript
const [showBanner, setShowBanner] = useState(false);
const [showSettings, setShowSettings] = useState(false);
const [consent, setConsent] = useState<Record<string, boolean>>({
  analytics: false,
  marketing: false,
});

useEffect(() => {
  const stored = localStorage.getItem("cookie-consent");
  if (!stored) {
    setShowBanner(true);
  }
}, []);

const handleAcceptAll = () => {
  const state = { accepted: true, categories: { analytics: true, marketing: true }, timestamp: new Date().toISOString() };
  localStorage.setItem("cookie-consent", JSON.stringify(state));
  setShowBanner(false);
};

const handleDecline = () => {
  const state = { accepted: true, categories: { analytics: false, marketing: false }, timestamp: new Date().toISOString() };
  localStorage.setItem("cookie-consent", JSON.stringify(state));
  setShowBanner(false);
};
```

## リファレンスコード

### CookieConsent コンポーネント実装例
```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CookieConsentProps {
  theme: {
    background: string;
    border: string;
    text: string;
    acceptBg: string;
    declineBg: string;
  };
  mobileBottomOffset?: boolean;  // SP固定バーがある場合
}

export function CookieConsent({ theme, mobileBottomOffset }: CookieConsentProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setShow(true);
    }
  }, []);

  const handleAccept = (all: boolean) => {
    const state = {
      accepted: true,
      categories: { analytics: all, marketing: all },
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-consent", JSON.stringify(state));
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed left-0 right-0 z-40 ${theme.background} ${theme.border} border-t px-5 py-4
            ${mobileBottomOffset ? "bottom-16 md:bottom-0" : "bottom-0"}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className={`${theme.text} text-sm flex-1`}>
              当サイトでは、利便性向上とサービス改善のためにCookieを使用しています。
              <a href="/privacy" className="underline ml-1">プライバシーポリシー</a>
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleAccept(false)}
                className={`px-4 py-2 text-sm ${theme.declineBg} transition-colors`}>
                必要最低限のみ
              </button>
              <button onClick={() => handleAccept(true)}
                className={`px-4 py-2 text-sm text-white ${theme.acceptBg} transition-colors`}>
                すべて許可
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### warm-craft テンプレートでの使用例
```tsx
// src/app/portfolio-templates/warm-craft/page.tsx
export default function WarmCraftPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WorksSection />
        <StrengthsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieConsent
        theme={{
          background: "bg-[#FAF7F2]",
          border: "border-[#E8DFD3]",
          text: "text-[#3D3226]",
          acceptBg: "bg-[#7BA23F]",
          declineBg: "text-[#8B7D6B] hover:text-[#3D3226]",
        }}
        mobileBottomOffset={true}
      />
    </>
  );
}
```

## 3層チェック

> この機能の核: **邪魔にならずに消えて、サイト閲覧を妨げない**
> 核が実現されているかどうかを、3層で検証する。

### Layer 1: 機能チェック（動くか）— 30点

技術的に正しく動作するかの検証。全項目PASSが前提条件。1つでもFAILなら全体70点未満（作り直し）。

| # | チェック項目 | 合格基準 | FAIL例 |
|---|---|---|---|
| F-1 | バナー表示 | 画面下部に `fixed bottom-0 z-40` でバナーが表示される | バナーが表示されない。位置がfixedでなくスクロールで消える |
| F-2 | 承諾ボタン | 「すべて許可」ボタンをクリックするとバナーが消える | ボタンが反応しない。クリックしてもバナーが残る |
| F-3 | 拒否ボタン | 「必要最低限のみ」ボタンをクリックするとバナーが消える | 拒否ボタンがない。クリックしても動作しない |
| F-4 | localStorage保存 | ユーザーの同意状態が `localStorage` に正しくJSON保存される | 保存されない。JSONが壊れている |
| F-5 | 再表示防止 | 2回目以降の訪問で `localStorage` を確認しバナー非表示 | 毎回バナーが表示される。localStorageチェックが未実装 |
| F-6 | プライバシーリンク | プライバシーポリシーへのリンクが正しいURLに遷移する | リンクなし。404エラー |
| F-7 | AnimatePresence | スライドアップ表示+フェードアウトのアニメーションが動作する | アニメーションなしでパッと出る。exit処理なし |
| F-8 | z-index | z-40でヘッダー(z-50)より下、コンテンツより上 | z-indexが高すぎてヘッダーを覆う。低すぎてコンテンツの下に隠れる |
| F-9 | reduced-motion | `prefers-reduced-motion` 時にアニメーションが即完了 | 設定無視でアニメーション再生される |
| F-10 | カラースキーム | バナー背景・ボタン色がテンプレートのパレットに合致 | 色がハードコードでテンプレートと合わない |

### Layer 2: UXチェック（迷わないか）— 40点

ユーザーが操作に迷わず、ストレスなく目的の情報に辿り着けるかの検証。

| # | チェック項目 | 合格基準 | 閾値 | 配点 |
|---|---|---|---|---|
| U-1 | 1タップで消えるか | バナーが**ボタン1回のタップで即座に消える** | 「すべて許可」or「必要最低限のみ」のどちらかで0.3秒以内に消える | 10点 |
| U-2 | コンテンツを隠さないか | バナーが**メインコンテンツの閲覧を妨げない**高さで表示される | バナーの高さが画面の20%以下。スマホでも記事が読める | 10点 |
| U-3 | 2回目以降表示されないか | 再訪時に**バナーが一切表示されない** | localStorageに同意記録があれば即非表示。フラッシュ表示もなし | 8点 |
| U-4 | SP固定バーとの共存 | warm-craftのSP電話バーと**バナーが重ならず両方操作可能** | `bottom-16 md:bottom-0` でバナー位置をオフセット | 5点 |
| U-5 | ボタンのタップ領域 | 承諾/拒否ボタンが**44px以上のタップ領域**を持つ | パディング含め44px以上。隣のボタンと誤タップしない | 7点 |

### Layer 3: 価値チェック（邪魔にならないか）— 30点

この機能の核「邪魔にならずに消えて、サイト閲覧を妨げない」が実現されているかの検証。**ここが80点と90点を分ける。**

| # | チェック項目 | 合格基準 | 90点の例 | 80点の例 | FAIL例 |
|---|---|---|---|---|---|
| V-1 | 邪魔に感じないか | ユーザーが**「邪魔だ」と感じない** | 画面下部にコンパクト表示。文字が短く1行。即座に消せる | バナーは出るが2行程度で控えめ | バナーが画面の半分を覆い、記事が読めない |
| V-2 | 法的要件の充足 | **個人情報保護法・改正電気通信事業法の要件**を満たしている | Cookie使用目的の明示+同意/拒否の選択肢+詳細へのリンク | 同意/拒否ボタンとプライバシーリンクがある | 同意ボタンのみ。拒否できない。法的要件不足 |
| V-3 | 文言の適切さ | バナーの文言が**業種に適した内容**になっている | 医療:「健康情報はCookieに保存されません」と明記 | 汎用的だが問題のない文言 | 医療サイトで「マーケティング目的」のみ言及 |
| V-4 | 初回体験への影響 | 初訪問時の**第一印象を損なわない** | ページ読み込み後0.5秒で控えめにスライドアップ。ヒーロー画像は見える | バナーは出るがコンテンツの邪魔にはならない | ページ読み込み直後にバナーがメインビジュアルを隠す |
| V-5 | 詳細設定の提供 | Cookieカテゴリ別の**オン/オフ選択ができる** | 「詳細設定」モーダルで分析/マーケティングの個別トグル | 全許可/全拒否の2択だが問題なし | 「すべて許可」のみ。拒否手段がない |
| V-6 | レスポンシブ体験 | モバイル/デスクトップ両方で**自然な表示** | モバイル縦積み+デスクトップ横並びでどちらも圧迫感なし | レイアウトは対応しているが余白が少ない | モバイルでボタンがはみ出す。横スクロール発生 |

## スコアリング

### 合計100点の内訳

| 層 | 配点 | 内容 |
|---|---|---|
| Layer 1: 機能 | 30点 | 10項目全PASSで30点。1つでもFAILなら0点（作り直し） |
| Layer 2: UX | 40点 | 5項目、各項目の配点通り。部分点あり |
| Layer 3: 価値 | 30点 | 6項目、各5点。部分点あり |

### 判定ルール

| スコア | 判定 | アクション |
|---|---|---|
| 90〜100 | **PASS** | そのまま次の機能へ。核が実現されている |
| 80〜89 | **CONDITIONAL** | Layer 2 or 3 の減点箇所を特定し修正。修正後に再チェック |
| 70〜79 | **FAIL** | Layer 1 は通るがUXか価値が不足。原因を記録し、該当層を作り直し |
| 0〜69 | **CRITICAL FAIL** | Layer 1 がFAIL。機能として動いていない。全体を作り直し |

### 採点の具体例

**90点の実装:**
- localStorage保存+再表示防止+AnimatePresence全て動作（L1: 30/30）
- 1タップで消える。画面の15%以下。SP電話バーと重ならない（L2: 35/40）
- コンパクト1行表示。ヒーローが見える。カテゴリ別トグルあり（L3: 25/30）

**80点の実装:**
- バナー表示+ボタン動作+localStorage保存OK（L1: 30/30）
- 1タップで消えるが2行で少し高い。2回目は出ない（L2: 28/40）
- 全許可/全拒否の2択。邪魔ではないが詳細設定なし（L3: 22/30）

**70点の実装:**
- バナーは動く（L1: 30/30）
- バナーが画面の25%を覆う。SP電話バーと重なる（L2: 22/40）
- 「すべて許可」のみ。拒否できない（L3: 18/30）

### この機能固有の重要判定ポイント

1. **再表示防止の確実性**: 同意済みなのに毎回バナーが出るのは最悪のUX。**localStorageチェックが初回レンダリング前に実行されないとフラッシュ表示が起きる（F-5重点確認）**
2. **SP電話バーとの干渉**: warm-craftテンプレートでバナーと電話バーが重なると**両方タップ不能になる致命的バグ**。`bottom-16 md:bottom-0` の有無を必ず確認
3. **拒否手段の存在**: 「すべて許可」のみで拒否できない実装は**法的要件不足でV-2自動FAIL**
