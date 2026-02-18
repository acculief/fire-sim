import { Metadata } from "next";
import Link from "next/link";
import { prefectures, getPrefectureByCode } from "@/data/prefectures";
import { INCOME_LEVELS, FAMILY_TYPES_FOR_SEO, AGE_GROUPS_FOR_SEO, HOUSING_TYPES_FOR_SEO } from "@/config/assumptions";
import { generateCaseExamples } from "@/lib/seo-helpers";
import { formatMoney } from "@/lib/format";
import FAQ, { getDefaultFAQ } from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { guides } from "@/data/guides";

export function generateStaticParams() {
  return prefectures.map((p) => ({ pref: p.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pref: string }>;
}): Promise<Metadata> {
  const { pref } = await params;
  const prefecture = getPrefectureByCode(pref);
  const name = prefecture?.name ?? pref;
  return {
    title: `${name}のFIREシミュレーション | 必要資産・達成年を計算`,
    description: `${name}在住の方向けFIREシミュレーション。地域の生活費係数（${prefecture?.costIndex}）を反映した必要資産額と達成年を計算できます。`,
    openGraph: {
      title: `${name}のFIREシミュレーション`,
      description: `${name}の生活費に基づくFIRE必要資産と達成年`,
    },
  };
}

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ pref: string }>;
}) {
  const { pref } = await params;
  const prefecture = getPrefectureByCode(pref);
  if (!prefecture) return <div>地域が見つかりません</div>;

  const cases = generateCaseExamples(pref);
  const faqItems = getDefaultFAQ(prefecture.name);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "地域別", href: "/fire/" },
          { label: prefecture.name },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {prefecture.name}のFIREシミュレーション
      </h1>
      <p className="mt-2 text-gray-600">
        {prefecture.name}（{prefecture.region}）の生活費係数は
        <strong>{prefecture.costIndex}</strong>
        です。全国平均を1.0とした場合の相対的な生活コストを表しています。
      </p>

      {/* CTA */}
      <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
        <p className="font-medium text-primary-800">
          あなたの条件で計算してみましょう
        </p>
        <Link
          href={`/simulate/?pref=${pref}`}
          className="btn-primary mt-3 inline-block"
        >
          {prefecture.name}で詳細シミュレーション
        </Link>
      </div>

      {/* 代表ケース */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name}の代表的なケース
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          30歳開始、資産300万円、月10万円積立、利回り4%、SWR4%の場合
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${prefecture.name}の代表的なFIREシミュレーション結果`}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  条件
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  月間生活費
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  必要資産
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">
                  達成年齢
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map((c) => (
                <tr key={c.label}>
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {c.label}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {c.monthlyExpense}万円
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatMoney(c.fireNumber)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {c.achievementAge !== null ? `${c.achievementAge}歳` : "ー"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 年収別リンク */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name} × 年収別
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {INCOME_LEVELS.map((il) => (
            <Link
              key={il.value}
              href={`/fire/${pref}/income/${il.value}/`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              年収{il.label}
            </Link>
          ))}
          <Link
            href="/income/"
            className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100"
          >
            手取り早見表で確認 →
          </Link>
        </div>
      </section>

      {/* 家族構成別リンク */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name} × 家族構成別
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {FAMILY_TYPES_FOR_SEO.map((ft) => (
            <Link
              key={ft.key}
              href={`/fire/${pref}/family/${ft.key}/`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {ft.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 年代別リンク */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name} × 年代別
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {AGE_GROUPS_FOR_SEO.map((ag) => (
            <Link
              key={ag.slug}
              href={`/fire/${pref}/age/${ag.slug}/`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {ag.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 住宅タイプ別リンク */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name} × 住宅タイプ別
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {HOUSING_TYPES_FOR_SEO.map((ht) => (
            <Link
              key={ht.key}
              href={`/fire/${pref}/housing/${ht.key}/`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {ht.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 地域の生活費傾向 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name}の生活費傾向
        </h2>
        <div className="mt-3 text-gray-600">
          <p>
            {prefecture.name}の生活費係数は<strong>{prefecture.costIndex}</strong>
            で、
            {prefecture.costIndex > 1.0
              ? "全国平均より高い水準"
              : prefecture.costIndex === 1.0
                ? "全国平均と同水準"
                : "全国平均より低い水準"}
            です。
            {prefecture.costIndex >= 1.1
              ? "特に家賃が高く、住居費がFIRE必要資産に大きく影響します。持ち家か賃貸かで大きな差が出るため、住宅戦略が重要です。"
              : prefecture.costIndex <= 0.9
                ? "生活コストが低いため、同じ年収・貯蓄率でもFIRE達成が比較的早くなります。地方移住によるFIRE戦略として注目されています。"
                : "バランスの取れた生活費水準で、堅実な積立投資で着実にFIREを目指せます。"}
          </p>
        </div>
      </section>

      {/* 同じ地方の他県との比較 */}
      {(() => {
        const sameRegion = prefectures
          .filter((p) => p.region === prefecture.region)
          .sort((a, b) => a.costIndex - b.costIndex);
        return sameRegion.length > 1 ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">
              {prefecture.region}の生活費比較
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {prefecture.region}内の都道府県を生活費係数で比較
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm" aria-label={`${prefecture.region}の生活費比較`}>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-600">
                      都道府県
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">
                      生活費係数
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-gray-600">
                      全国平均比
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sameRegion.map((p) => (
                    <tr
                      key={p.code}
                      className={
                        p.code === pref ? "bg-primary-50" : ""
                      }
                    >
                      <td className="px-3 py-2">
                        {p.code === pref ? (
                          <span className="font-bold text-primary-700">
                            {p.name}
                          </span>
                        ) : (
                          <Link
                            href={`/fire/${p.code}/`}
                            className="text-primary-600 hover:underline"
                          >
                            {p.name}
                          </Link>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {p.costIndex}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {p.costIndex >= 1.0 ? "+" : ""}
                        {Math.round((p.costIndex - 1.0) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null;
      })()}

      {/* 関連ガイド記事 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          FIREに役立つガイド記事
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {guides.slice(0, 4).map((article) => (
            <Link
              key={article.slug}
              href={`/guide/${article.slug}/`}
              className="block rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <p className="text-sm font-bold text-gray-800">
                {article.title}
              </p>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
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

      {/* FAQ */}
      <section className="mt-10">
        <FAQ items={faqItems} prefName={prefecture.name} />
      </section>

      {/* CTA */}
      <section className="mt-10 text-center">
        <Link
          href={`/simulate/?pref=${pref}`}
          className="btn-primary inline-block text-lg"
        >
          {prefecture.name}でFIREシミュレーション開始
        </Link>
      </section>

      {/* 免責 */}
      <section className="mt-10">
        <Disclaimer />
      </section>

      {/* 構造化データ */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${prefecture.name}のFIREシミュレーション`,
          description: `${prefecture.name}在住の方向けFIREシミュレーション`,
        }}
      />
    </div>
  );
}
