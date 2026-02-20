import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/config/site";
import GoogleAnalyticsPageview from "@/components/GoogleAnalytics";
import Link from "next/link";
import Header from "@/components/Header";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FIREシミュレーター | 地域別・年収別で達成年を計算",
    template: "%s | FIREシミュレーター",
  },
  description:
    "あなたの地域・年収・家族構成に合わせたFIRE（経済的自立・早期退職）達成シミュレーション。必要資産額と達成年を簡単計算。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "FIREシミュレーター",
    url: "/",
    title: "FIREシミュレーター | 地域別・年収別で達成年を計算",
    description:
      "あなたの地域・年収・家族構成に合わせたFIRE（経済的自立・早期退職）達成シミュレーション。必要資産額と達成年を簡単計算。",
    images: [`${SITE_URL}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
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
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <GoogleAnalyticsPageview />
        <Analytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
        >
          メインコンテンツへスキップ
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <footer className="mt-16 border-t border-gray-200 bg-white" role="contentinfo">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="grid gap-6 text-sm sm:grid-cols-3">
              <nav aria-label="フッターナビゲーション">
                <p className="font-bold text-gray-700">コンテンツ</p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li><Link href="/simulate/" className="hover:text-primary-600">シミュレーション</Link></li>
                  <li><Link href="/diagnose/" className="hover:text-primary-600">FIRE診断</Link></li>
                  <li><Link href="/withdraw/" className="hover:text-primary-600">取り崩しシミュレーション</Link></li>
                  <li><Link href="/tracker/" className="hover:text-primary-600">進捗トラッカー</Link></li>
                  <li><Link href="/guide/" className="hover:text-primary-600">ガイド記事</Link></li>
                  <li><Link href="/recommend/" className="hover:text-primary-600">おすすめツール</Link></li>
                  <li><Link href="/fire/" className="hover:text-primary-600">地域別一覧</Link></li>
                  <li><Link href="/income/" className="hover:text-primary-600">手取り早見表</Link></li>
                  <li><Link href="/cases/" className="hover:text-primary-600">モデルケース</Link></li>
                  <li><Link href="/plan/" className="hover:text-primary-600">年収×年代別プラン</Link></li>
                  <li><Link href="/faq/" className="hover:text-primary-600">よくある質問</Link></li>
                </ul>
              </nav>
              <nav aria-label="人気の地域">
                <p className="font-bold text-gray-700">人気の地域</p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li><Link href="/fire/tokyo/" className="hover:text-primary-600">東京都</Link></li>
                  <li><Link href="/fire/osaka/" className="hover:text-primary-600">大阪府</Link></li>
                  <li><Link href="/fire/kanagawa/" className="hover:text-primary-600">神奈川県</Link></li>
                  <li><Link href="/fire/aichi/" className="hover:text-primary-600">愛知県</Link></li>
                  <li><Link href="/fire/fukuoka/" className="hover:text-primary-600">福岡県</Link></li>
                </ul>
              </nav>
              <nav aria-label="人気のガイド記事">
                <p className="font-bold text-gray-700">人気のガイド</p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li><Link href="/guide/what-is-fire/" className="hover:text-primary-600">FIREとは？</Link></li>
                  <li><Link href="/guide/fire-first-steps/" className="hover:text-primary-600">FIRE初心者の始め方</Link></li>
                  <li><Link href="/guide/how-to-choose-broker/" className="hover:text-primary-600">証券口座の選び方</Link></li>
                  <li><Link href="/guide/nisa-fire-acceleration/" className="hover:text-primary-600">新NISAでFIRE加速</Link></li>
                  <li><Link href="/guide/fire-index-investing/" className="hover:text-primary-600">インデックス投資入門</Link></li>
                </ul>
              </nav>
            </div>
            <hr className="my-6 border-gray-200" />
            <p className="text-center text-xs text-gray-600">
              ※本シミュレーションは概算であり、投資助言ではありません。実際の投資判断はご自身の責任で行ってください。
            </p>
            <p className="mt-2 text-center text-xs text-gray-600">
              &copy; 2026 FIREシミュレーター
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
