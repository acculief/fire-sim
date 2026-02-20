import Link from "next/link";
import { prefectures } from "@/data/prefectures";
import { guides } from "@/data/guides";
import { SITE_URL } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import SimulationCounter from "@/components/SimulationCounter";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FIREシミュレーター",
  url: SITE_URL,
  description:
    "あなたの地域・年収・家族構成に合わせたFIRE達成シミュレーション。必要資産額と達成年を簡単計算。",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/fire/{search_term_string}/`,
    "query-input": "required name=search_term_string",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FIREシミュレーター",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          あなたの地域・年収・家族構成で
          <br />
          <span className="text-primary-600">FIRE達成年</span>を計算
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          居住地域の生活コスト、家族構成、住宅形態を考慮した
          現実的なFIREシミュレーション。必要資産額と達成年を今すぐ確認できます。
        </p>
        {/* 実績バッジ */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            47都道府県対応
          </span>
          <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            3シナリオ比較
          </span>
          <span className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            完全無料
          </span>
        </div>

        <div className="mt-6">
          <Link href="/simulate/" className="btn-primary inline-block text-lg">
            無料でシミュレーション開始
          </Link>
        </div>
        <SimulationCounter />
      </section>

      {/* ツール一覧 */}
      <section className="mt-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/diagnose/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">FIRE診断</p>
            <p className="mt-1 text-xs text-gray-600">約1分で達成度を診断</p>
          </Link>
          <Link
            href="/tracker/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">進捗トラッカー</p>
            <p className="mt-1 text-xs text-gray-600">毎月の資産推移を記録</p>
          </Link>
          <Link
            href="/withdraw/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">取り崩しシミュレーション</p>
            <p className="mt-1 text-xs text-gray-600">FIRE後の資産寿命を計算</p>
          </Link>
          <Link
            href="/recommend/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">おすすめ証券口座</p>
            <p className="mt-1 text-xs text-gray-600">ネット証券を徹底比較</p>
          </Link>
        </div>
      </section>

      {/* モデルケース・プラン・FAQ */}
      <section className="mt-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/income/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">手取り早見表</p>
            <p className="mt-1 text-xs text-gray-600">年収別の手取り額・税金・社会保険料を一覧で確認</p>
          </Link>
          <Link
            href="/cases/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">モデルケース</p>
            <p className="mt-1 text-xs text-gray-600">年収・家族構成別のFIRE達成事例を紹介</p>
          </Link>
          <Link
            href="/plan/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">年収×年代別プラン</p>
            <p className="mt-1 text-xs text-gray-600">あなたの年収と年齢に最適なFIRE戦略</p>
          </Link>
          <Link
            href="/faq/"
            className="link-card"
          >
            <p className="font-bold text-gray-800">よくある質問</p>
            <p className="mt-1 text-xs text-gray-600">FIREの基礎知識・4%ルール・新NISAなど</p>
          </Link>
        </div>
      </section>

      {/* 地域別リンク */}
      <section className="mt-12">
        <h2 className="text-center text-xl font-bold text-gray-900">
          地域別FIRE情報
        </h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {prefectures
            .filter((p) =>
              ["tokyo", "osaka", "kanagawa", "aichi", "fukuoka", "hokkaido", "saitama", "chiba", "hyogo", "miyagi"].includes(p.code)
            )
            .map((p) => (
              <Link
                key={p.code}
                href={`/fire/${p.code}/`}
                className="tag-link"
              >
                {p.name}
              </Link>
            ))}
        </div>
        <div className="mt-3 text-center">
          <Link
            href="/fire/"
            className="text-sm text-primary-600 hover:text-primary-500 hover:underline"
          >
            47都道府県すべてを見る →
          </Link>
        </div>
      </section>

      {/* ガイド記事 */}
      <section className="mt-12">
        <h2 className="text-center text-xl font-bold text-gray-900">
          FIREガイド
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {guides.slice(0, 4).map((article) => (
            <Link
              key={article.slug}
              href={`/guide/${article.slug}/`}
              className="block rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <h3 className="text-sm font-bold text-gray-800">{article.title}</h3>
              <p className="mt-0.5 text-xs text-gray-600 line-clamp-1">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-3 text-center">
          <Link
            href="/guide/"
            className="text-sm text-primary-600 hover:text-primary-500 hover:underline"
          >
            すべてのガイド記事を見る →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 text-center">
        <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6">
          <p className="text-lg font-bold text-primary-800">
            今すぐFIRE達成年を計算しましょう
          </p>
          <Link
            href="/simulate/"
            className="btn-primary mt-3 inline-block"
          >
            シミュレーションを始める
          </Link>
        </div>
      </section>
    </div>
  );
}
