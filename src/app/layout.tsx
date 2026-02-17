import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fire-sim-phi.vercel.app"),
  title: {
    default: "FIREシミュレーター | 地域別・年収別で達成年を計算",
    template: "%s | FIREシミュレーター",
  },
  description:
    "あなたの地域・年収・家族構成に合わせたFIRE（経済的自立・早期退職）達成シミュレーション。必要資産額と達成年を簡単計算。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "FIREシミュレーター",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "FIREシミュ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.className}>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
        >
          メインコンテンツへスキップ
        </a>
        <header className="border-b border-gray-200 bg-white" role="banner">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a href="/" className="shrink-0 text-base font-bold text-primary-700 sm:text-xl">
              FIREシミュレーター
            </a>
            <nav aria-label="メインナビゲーション" className="flex gap-2 text-xs sm:gap-4 sm:text-sm">
              <a
                href="/simulate/"
                className="text-gray-600 transition-colors hover:text-primary-600"
              >
                シミュレーション
              </a>
              <a
                href="/diagnose/"
                className="text-gray-600 transition-colors hover:text-primary-600"
              >
                診断
              </a>
              <a
                href="/tracker/"
                className="text-gray-600 transition-colors hover:text-primary-600"
              >
                トラッカー
              </a>
              <a
                href="/guide/"
                className="hidden text-gray-600 transition-colors hover:text-primary-600 sm:block"
              >
                ガイド
              </a>
              <a
                href="/recommend/"
                className="hidden text-gray-600 transition-colors hover:text-primary-600 sm:block"
              >
                おすすめ
              </a>
              <a
                href="/fire/"
                className="hidden text-gray-600 transition-colors hover:text-primary-600 sm:block"
              >
                地域別
              </a>
            </nav>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white" role="contentinfo">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid gap-6 text-sm sm:grid-cols-3">
              <div>
                <p className="font-bold text-gray-700">コンテンツ</p>
                <ul className="mt-2 space-y-1 text-gray-500">
                  <li><a href="/simulate/" className="hover:text-primary-600">シミュレーション</a></li>
                  <li><a href="/guide/" className="hover:text-primary-600">ガイド記事</a></li>
                  <li><a href="/recommend/" className="hover:text-primary-600">おすすめツール</a></li>
                  <li><a href="/diagnose/" className="hover:text-primary-600">FIRE診断</a></li>
                  <li><a href="/tracker/" className="hover:text-primary-600">進捗トラッカー</a></li>
                  <li><a href="/fire/" className="hover:text-primary-600">地域別一覧</a></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-gray-700">人気の地域</p>
                <ul className="mt-2 space-y-1 text-gray-500">
                  <li><a href="/fire/tokyo/" className="hover:text-primary-600">東京都</a></li>
                  <li><a href="/fire/osaka/" className="hover:text-primary-600">大阪府</a></li>
                  <li><a href="/fire/kanagawa/" className="hover:text-primary-600">神奈川県</a></li>
                  <li><a href="/fire/aichi/" className="hover:text-primary-600">愛知県</a></li>
                  <li><a href="/fire/fukuoka/" className="hover:text-primary-600">福岡県</a></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-gray-700">人気のガイド</p>
                <ul className="mt-2 space-y-1 text-gray-500">
                  <li><a href="/guide/what-is-fire/" className="hover:text-primary-600">FIREとは？</a></li>
                  <li><a href="/guide/4percent-rule/" className="hover:text-primary-600">4%ルール解説</a></li>
                  <li><a href="/guide/fire-index-investing/" className="hover:text-primary-600">インデックス投資入門</a></li>
                  <li><a href="/guide/nisa-ideco-for-fire/" className="hover:text-primary-600">新NISA活用法</a></li>
                </ul>
              </div>
            </div>
            <hr className="my-6 border-gray-200" />
            <p className="text-center text-xs text-gray-500">
              ※本シミュレーションは概算であり、投資助言ではありません。実際の投資判断はご自身の責任で行ってください。
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              &copy; 2026 FIREシミュレーター
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
