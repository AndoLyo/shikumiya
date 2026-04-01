export default function Footer() {
  return (
    <footer
      className="px-6 py-10"
      style={{ backgroundColor: "var(--color-text)", color: "#999" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} warm.natural — All rights reserved.
        </p>
        <nav className="flex gap-6">
          <a
            href="#"
            className="text-xs transition-colors hover:text-white"
          >
            プライバシーポリシー
          </a>
          <a
            href="#"
            className="text-xs transition-colors hover:text-white"
          >
            利用規約
          </a>
          <a
            href="#"
            className="text-xs transition-colors hover:text-white"
          >
            トップに戻る
          </a>
        </nav>
      </div>
    </footer>
  );
}
