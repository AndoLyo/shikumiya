export const metadata = {
  title: "プライバシーポリシー | Lyo Vision",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px", color: "#e0e0e0", lineHeight: 1.8, fontFamily: "'Segoe UI', 'Hiragino Sans', sans-serif" }}>
      <h1 style={{ fontSize: "1.5em", borderBottom: "2px solid #555", paddingBottom: 8 }}>プライバシーポリシー</h1>
      <p style={{ color: "#888", fontSize: "0.9em" }}>最終更新日: 2026年3月21日</p>

      <h2 style={{ fontSize: "1.1em", marginTop: 24 }}>1. 運営者</h2>
      <p>本アプリ「SNS AutoControl App」は、Lyo Vision（個人事業）が運営しています。</p>

      <h2 style={{ fontSize: "1.1em", marginTop: 24 }}>2. 取得する情報</h2>
      <p>本アプリは、Instagram・Threads・X のAPI連携のため、以下の情報にアクセスします。</p>
      <ul>
        <li>アカウントのプロフィール情報（ユーザー名、ID）</li>
        <li>投稿およびコメントの内容</li>
        <li>ダイレクトメッセージ（送受信）</li>
        <li>インサイト情報（閲覧数等）</li>
      </ul>

      <h2 style={{ fontSize: "1.1em", marginTop: 24 }}>3. 利用目的</h2>
      <ul>
        <li>自身のSNSアカウントにおける投稿・コメント返信の自動化</li>
        <li>エンゲージメント分析</li>
      </ul>

      <h2 style={{ fontSize: "1.1em", marginTop: 24 }}>4. 第三者提供</h2>
      <p>取得した情報を第三者に提供・販売することはありません。</p>

      <h2 style={{ fontSize: "1.1em", marginTop: 24 }}>5. データの保存</h2>
      <p>取得した情報はローカル環境にのみ保存され、外部サーバーへの送信は行いません。</p>

      <h2 style={{ fontSize: "1.1em", marginTop: 24 }}>6. データの削除</h2>
      <p>アプリ連携を解除することで、保存されたデータを削除できます。削除のご依頼は下記連絡先までお願いします。</p>

      <h2 style={{ fontSize: "1.1em", marginTop: 24 }}>7. お問い合わせ</h2>
      <p>ando.lyo.ai@gmail.com</p>
    </main>
  );
}
