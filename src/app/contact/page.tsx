import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | FIREシミュレーター",
  description: "FIREシミュレーターへのお問い合わせはこちらからどうぞ。",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
      <p className="text-xs text-gray-400 mb-10">fire-simulator.net 運営部</p>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <p>
          ご質問・ご意見・不具合のご報告など、お気軽にメールでお問い合わせください。
          内容を確認のうえ、順次ご返信いたします。
          お返事までにお時間をいただく場合がございますので、あらかじめご了承ください。
        </p>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-xs text-gray-500 mb-3">お問い合わせ先メールアドレス</p>
          <a
            href="mailto:contact@fire-simulator.net"
            className="text-lg font-medium text-blue-600 underline hover:text-blue-800 break-all"
          >
            contact@fire-simulator.net
          </a>
        </div>

        <div className="text-xs text-gray-400 space-y-1 pt-2">
          <p>※ 投資に関する個別相談には対応しておりません。</p>
          <p>※ 広告・スパムメールへのご返信はしかねます。</p>
        </div>
      </div>
    </div>
  );
}
