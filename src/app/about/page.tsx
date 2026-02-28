import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営について | FIREシミュレーター",
  description: "FIREシミュレーターのサイト概要・運営者情報・免責事項・プライバシーポリシーです。",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">運営について</h1>
      <p className="text-xs text-gray-400 mb-10">最終更新日：2026年2月</p>

      <div className="space-y-10 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">サイトについて</h2>
          <p>
            「FIREシミュレーター」は、資産・支出・利回りを入力するだけで、FIRE（Financial Independence, Retire Early）達成までの期間をシミュレートできる無料ツールです。
            地域別・年収別の詳細シミュレーションや、取り崩し計算・複利計算・FIRE診断など多彩な機能を提供しています。
            FIREを目指すすべての方が、自分の状況に合った計画を立てるためのサポートをします。
            すべての機能は無料でご利用いただけます。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">運営者情報</h2>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">サイト名</td>
                <td className="py-2.5">FIREシミュレーター</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">運営</td>
                <td className="py-2.5">fire-simulator.net 運営部</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">URL</td>
                <td className="py-2.5">https://fire-simulator.net</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">お問い合わせ</td>
                <td className="py-2.5">
                  <a
                    href="mailto:contact@fire-simulator.net"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    contact@fire-simulator.net
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">免責事項</h2>
          <p>
            当サイトのシミュレーション結果は、入力値をもとにした概算であり、将来の運用成果を保証するものではありません。
            実際の投資・資産運用の判断はご自身の責任において行ってください。
          </p>
          <p className="mt-2">
            当サイトに掲載されている情報は、正確性を期すよう努めていますが、
            その内容の正確性・完全性・最新性について、いかなる保証も行うものではありません。
            税制・法律は変更される場合があり、情報が最新でない可能性があります。
          </p>
          <p className="mt-2">
            当サイトの情報は投資助言を目的としたものではありません。
            実際の投資判断にあたっては、専門家（ファイナンシャルプランナー等）にご相談ください。
          </p>
          <p className="mt-2">
            当サイトのご利用により生じたいかなる損害についても、運営は一切の責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">プライバシーポリシー</h2>
          <p>
            当サイトでは、サービスの提供・改善およびアクセス解析のため、Cookieおよびアクセスログ
            （IPアドレス・ブラウザ情報・アクセス日時等）を収集しています。
            これらの情報は個人を特定するものではなく、統計的な分析にのみ使用します。
          </p>
          <p className="mt-2">
            広告配信のためにGoogle AdSenseを利用しており、Googleがアクセス情報に基づいて広告を配信することがあります。
            広告のパーソナライズを無効にするには
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 mx-1"
            >
              Google広告設定
            </a>
            からオプトアウトできます。
          </p>
          <p className="mt-2">
            また、Google Analyticsを使用してアクセス状況を分析しています。
            収集データはすべて匿名で処理され、個人を特定することはありません。
          </p>
          <p className="mt-2">
            Vercel Analyticsを利用してサイトのパフォーマンス計測を行っています。
            収集される情報はすべて集計データとして処理されます。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">著作権</h2>
          <p>
            当サイトに掲載されているコンテンツの著作権は運営に帰属します。
            無断転載・複製はご遠慮ください。
          </p>
          <p className="mt-4 text-xs text-gray-400">
            © 2026 fire-simulator.net 運営部 All Rights Reserved.
          </p>
        </section>
      </div>
    </div>
  );
}
