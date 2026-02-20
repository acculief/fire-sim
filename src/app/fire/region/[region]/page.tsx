import { Metadata } from "next";
import Link from "next/link";
import { prefectures } from "@/data/prefectures";
import { REGION_SLUGS } from "@/config/assumptions";
import { SITE_URL } from "@/config/site";
import { generateRegionComparison } from "@/lib/seo-helpers";
import { formatMoney } from "@/lib/format";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedGuides from "@/components/RelatedGuides";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return REGION_SLUGS.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const regionInfo = REGION_SLUGS.find((r) => r.slug === region);
  const label = regionInfo?.label ?? region;
  const regionPrefs = prefectures.filter((p) => p.region === label);
  return {
    title: `${label}のFIRE比較 | ${regionPrefs.map((p) => p.name).join("・")}`,
    description: `${label}地方${regionPrefs.length}${regionPrefs.length > 1 ? "都道府県" : "道"}の生活費・FIRE必要資産を比較。コスパの良い地域でFIRE達成を加速。`,
    alternates: { canonical: `/fire/region/${region}/` },
    openGraph: {
      title: `${label}地方のFIRE比較`,
      description: `${label}地方の都道府県別FIRE必要資産を比較`,
      url: `/fire/region/${region}/`,
    },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionInfo = REGION_SLUGS.find((r) => r.slug === region);
  if (!regionInfo) return <div>地方が見つかりません</div>;

  const comparison = generateRegionComparison(regionInfo.label);
  const cheapest = comparison[0];
  const mostExpensive = comparison[comparison.length - 1];
  const avgCostIndex =
    Math.round(
      (comparison.reduce((sum, c) => sum + c.costIndex, 0) / comparison.length) * 100
    ) / 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "地域別", href: "/fire/" },
          { label: `${regionInfo.label}地方` },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {regionInfo.label}地方のFIRE比較
      </h1>
      <p className="mt-2 text-gray-600">
        {regionInfo.label}地方{comparison.length}
        {comparison.length > 1 ? "都道府県" : "道"}の生活費係数とFIRE必要資産を比較します。
        年収500万円・独身・30歳開始の共通条件で、地域ごとの差を明らかにします。
      </p>

      {/* 地方サマリー */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {regionInfo.label}地方の概要
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
            <p className="text-sm text-gray-500">平均生活費係数</p>
            <p className="text-2xl font-bold text-gray-800">{avgCostIndex}</p>
          </div>
          {comparison.length > 1 && (
            <>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-sm text-green-700">最も生活費が低い</p>
                <p className="text-lg font-bold text-green-800">
                  {cheapest.name}（{cheapest.costIndex}）
                </p>
              </div>
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-center">
                <p className="text-sm text-orange-700">最も生活費が高い</p>
                <p className="text-lg font-bold text-orange-800">
                  {mostExpensive.name}（{mostExpensive.costIndex}）
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 都道府県比較表 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          都道府県別FIRE比較表
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          年収500万円・独身・30歳開始、資産300万円、月10万円積立、利回り4%、SWR4%の場合
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${regionInfo.label}地方の都道府県別FIRE比較`}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600">都道府県</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">生活費係数</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">月間生活費</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">必要資産</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">達成年齢</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparison.map((c) => (
                <tr key={c.code}>
                  <td className="px-3 py-2">
                    <Link
                      href={`/fire/${c.code}/`}
                      className="font-medium text-primary-600 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right">{c.costIndex}</td>
                  <td className="px-3 py-2 text-right">{c.monthlyExpense}万円</td>
                  <td className="px-3 py-2 text-right font-medium">{formatMoney(c.fireNumber)}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    {c.achievementAge !== null ? `${c.achievementAge}歳` : "ー"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* コスパ分析 */}
      {comparison.length > 1 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            {regionInfo.label}地方のFIREコスパ分析
          </h2>
          <div className="mt-3 space-y-3 text-gray-600">
            <p>
              {regionInfo.label}地方内で最もFIREしやすいのは
              <strong>{cheapest.name}</strong>（生活費係数{cheapest.costIndex}）です。
              必要資産は{formatMoney(cheapest.fireNumber)}で、
              {cheapest.achievementAge !== null
                ? `${cheapest.achievementAge}歳での達成`
                : "達成"}
              が見込めます。
            </p>
            <p>
              一方、<strong>{mostExpensive.name}</strong>（生活費係数{mostExpensive.costIndex}）
              では必要資産が{formatMoney(mostExpensive.fireNumber)}となり、
              {cheapest.fireNumber > 0 && mostExpensive.fireNumber > 0
                ? `約${formatMoney(mostExpensive.fireNumber - cheapest.fireNumber)}の差`
                : "差"}
              が生まれます。
            </p>
            <p>
              同じ{regionInfo.label}地方内でも、住む場所によってFIRE達成のハードルは
              大きく変わります。リモートワークが可能な場合は、
              生活費の低い地域を選ぶことでFIRE達成を加速できます。
            </p>
          </div>
        </section>
      )}

      {/* 各県ページへのリンク */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          各都道府県の詳細ページ
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {comparison.map((c) => (
            <Link
              key={c.code}
              href={`/fire/${c.code}/`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <span className="font-medium text-gray-800">{c.name}</span>
              <span className="text-sm text-gray-500">係数 {c.costIndex}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 他の地方へのリンク */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">他の地方を見る</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {REGION_SLUGS.filter((r) => r.slug !== region).map((r) => (
            <Link
              key={r.slug}
              href={`/fire/region/${r.slug}/`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </section>

      <RelatedGuides category="region" />

      <div className="mt-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          あなたの条件で計算する
        </p>
        <Link
          href="/simulate/"
          className="btn-primary mt-4 inline-block text-lg"
        >
          シミュレーション開始
        </Link>
      </div>

      <div className="mt-6 rounded-lg border border-accent-200 bg-accent-50 p-6 text-center">
        <p className="font-bold text-accent-800">
          まずはFIRE達成度をチェック
        </p>
        <p className="mt-1 text-sm text-accent-700">
          6つの質問に答えるだけで、あなたのFIREグレードがわかります
        </p>
        <Link
          href="/diagnose/"
          className="mt-3 inline-block rounded-lg bg-accent-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-700"
        >
          約1分でFIRE診断
        </Link>
      </div>

      <section className="mt-10">
        <Disclaimer />
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${regionInfo.label}地方のFIRE比較`,
          description: `${regionInfo.label}地方の都道府県別FIRE必要資産比較`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: comparison.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/fire/${c.code}/`,
              name: `${c.name}のFIREシミュレーション`,
            })),
          },
        }}
      />
    </div>
  );
}
