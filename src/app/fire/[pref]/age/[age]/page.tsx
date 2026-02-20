import { Metadata } from "next";
import Link from "next/link";
import { prefectures, getPrefectureByCode } from "@/data/prefectures";
import { AGE_GROUPS_FOR_SEO } from "@/config/assumptions";
import { generateAgeCases } from "@/lib/seo-helpers";
import { formatMoney } from "@/lib/format";
import FAQ, { getDefaultFAQ } from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedGuides from "@/components/RelatedGuides";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, CONTENT_PUBLISHED_DATE } from "@/config/site";

export function generateStaticParams() {
  const params: { pref: string; age: string }[] = [];
  for (const p of prefectures) {
    for (const ag of AGE_GROUPS_FOR_SEO) {
      params.push({ pref: p.code, age: ag.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pref: string; age: string }>;
}): Promise<Metadata> {
  const { pref, age } = await params;
  const prefecture = getPrefectureByCode(pref);
  const name = prefecture?.name ?? pref;
  const ageGroup = AGE_GROUPS_FOR_SEO.find((g) => g.slug === age);
  const ageLabel = ageGroup?.label ?? age;
  const title = `${name}・${ageLabel}のFIREシミュレーション | 必要資産・達成年`;
  const description = `${name}在住・${ageLabel}の方のFIRE必要資産と達成年を年収別にシミュレーション。${ageLabel}の平均的な初期資産と積立額で計算。`;
  return {
    title,
    description,
    alternates: { canonical: `/fire/${pref}/age/${age}/` },
    openGraph: { title, description, url: `/fire/${pref}/age/${age}/` },
  };
}

export default async function AgePage({
  params,
}: {
  params: Promise<{ pref: string; age: string }>;
}) {
  const { pref, age } = await params;
  const prefecture = getPrefectureByCode(pref);
  const ageGroup = AGE_GROUPS_FOR_SEO.find((g) => g.slug === age);
  if (!prefecture || !ageGroup) return <div>ページが見つかりません</div>;

  const cases = generateAgeCases(pref, age);
  const faqItems = getDefaultFAQ(prefecture.name);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${prefecture.name}・${ageGroup.label}のFIREシミュレーション`,
          url: `${SITE_URL}/fire/${pref}/age/${age}/`,
          datePublished: CONTENT_PUBLISHED_DATE,
          dateModified: CONTENT_PUBLISHED_DATE,
          inLanguage: "ja",
          isPartOf: { "@type": "WebSite", name: "FIREシミュレーター", url: SITE_URL },
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: prefecture.name, href: `/fire/${pref}/` },
          { label: `${ageGroup.label}` },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {prefecture.name}・{ageGroup.label}のFIREシミュレーション
      </h1>
      <p className="mt-2 text-gray-600">
        {prefecture.name}（生活費係数{prefecture.costIndex}）に住む{ageGroup.label}
        の方がFIREを目指す場合のシミュレーション結果です。
        {ageGroup.label}の平均的な初期資産（{ageGroup.currentAssets}万円）と
        月{ageGroup.monthlyInvestment}万円の積立を前提に計算しています。
      </p>

      <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
        <Link
          href={`/simulate/?pref=${pref}&age=${ageGroup.representativeAge}`}
          className="btn-primary inline-block"
        >
          自分の条件で詳細シミュレーション
        </Link>
      </div>

      {/* 年代別の前提条件 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">
          {ageGroup.label}の前提条件
        </h2>
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-gray-500">開始年齢</dt>
              <dd className="font-bold text-gray-800">{ageGroup.representativeAge}歳</dd>
            </div>
            <div>
              <dt className="text-gray-500">初期資産</dt>
              <dd className="font-bold text-gray-800">{ageGroup.currentAssets}万円</dd>
            </div>
            <div>
              <dt className="text-gray-500">月間積立</dt>
              <dd className="font-bold text-gray-800">{ageGroup.monthlyInvestment}万円</dd>
            </div>
            <div>
              <dt className="text-gray-500">運用利回り</dt>
              <dd className="font-bold text-gray-800">4.0%</dd>
            </div>
          </dl>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          ※ {ageGroup.label}の一般的な貯蓄額・投資余力を参考に設定した前提条件です
        </p>
      </section>

      {/* 年収別比較表 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">年収別の比較</h2>
        <p className="mt-1 text-sm text-gray-500">
          {ageGroup.representativeAge}歳開始、資産{ageGroup.currentAssets}万円、
          月{ageGroup.monthlyInvestment}万円積立、利回り4%、SWR4%の場合
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${prefecture.name}・${ageGroup.label}の年収別比較`}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="px-3 py-2 text-left font-medium text-gray-600">年収</th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">月間生活費</th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">必要資産</th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">達成年齢</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map((c) => (
                <tr key={c.label}>
                  <td className="px-3 py-2 font-medium text-gray-800">{c.label}</td>
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

      {/* 年代別ポイント解説 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {ageGroup.label}のFIRE戦略ポイント
        </h2>
        <div className="mt-3 space-y-3 text-gray-600">
          {ageGroup.slug === "20s" && (
            <>
              <p>
                20代は資産形成の初期段階ですが、<strong>複利の恩恵を最大限に受けられる</strong>
                最大のアドバンテージがあります。早期に投資を開始することで、
                30代・40代と比較して少ない月間積立額でもFIRE達成が可能です。
              </p>
              <p>
                {prefecture.name}では生活費係数が{prefecture.costIndex}のため、
                {prefecture.costIndex > 1.0
                  ? "生活費を抑える工夫が特に重要です。"
                  : "比較的低い生活費を活かして積極的に投資に回せます。"}
              </p>
            </>
          )}
          {ageGroup.slug === "30s" && (
            <>
              <p>
                30代はキャリアが安定し始め、<strong>収入と投資のバランスが取りやすい</strong>
                時期です。ある程度の初期資産があることで、複利効果と積立の相乗効果が期待できます。
              </p>
              <p>
                {prefecture.name}では生活費係数が{prefecture.costIndex}のため、
                {prefecture.costIndex > 1.0
                  ? "家賃や生活費が高めですが、収入も高い傾向にあるため、貯蓄率の最大化が鍵です。"
                  : "生活費が抑えられる分、積立額を増やすことでFIRE達成を加速できます。"}
              </p>
            </>
          )}
          {ageGroup.slug === "40s" && (
            <>
              <p>
                40代は<strong>これまでの蓄積が複利で大きく育つ</strong>フェーズです。
                初期資産が大きいため、投資期間が短くても相当額の資産形成が可能です。
              </p>
              <p>
                {prefecture.name}では生活費係数が{prefecture.costIndex}のため、
                {prefecture.costIndex > 1.0
                  ? "FIRE後の生活費を見据え、地方移住も選択肢として検討する価値があります。"
                  : "この生活費水準を維持できれば、比較的現実的なFIRE計画を立てられます。"}
              </p>
            </>
          )}
          {ageGroup.slug === "50s" && (
            <>
              <p>
                50代は<strong>最も多い初期資産からスタート</strong>できますが、
                投資期間が短いため、リスクを抑えた運用が重要です。
                退職金の活用やサイドFIREも現実的な選択肢です。
              </p>
              <p>
                {prefecture.name}では生活費係数が{prefecture.costIndex}のため、
                {prefecture.costIndex > 1.0
                  ? "FIRE後に生活費の低い地域への移住を組み合わせると、必要資産を大幅に削減できます。"
                  : "この低い生活費水準は50代FIREの強い味方です。退職後も安心して暮らせます。"}
              </p>
            </>
          )}
        </div>
      </section>

      {/* 他の年代へのリンク */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name}の他の年代
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {AGE_GROUPS_FOR_SEO.filter((g) => g.slug !== age).map((g) => (
            <Link
              key={g.slug}
              href={`/fire/${pref}/age/${g.slug}/`}
              className="tag-link"
            >
              {g.label}
            </Link>
          ))}
        </div>
      </section>

      <RelatedGuides category="age" />

      <section className="mt-10">
        <FAQ items={faqItems} prefName={prefecture.name} />
      </section>

      <section className="mt-8 text-center">
        <Link
          href={`/simulate/?pref=${pref}&age=${ageGroup.representativeAge}`}
          className="btn-primary inline-block text-lg"
        >
          シミュレーションを始める
        </Link>
      </section>

      <div className="mt-6 rounded-lg border border-accent-200 bg-accent-50 p-5 text-center">
        <p className="font-bold text-accent-800">FIRE達成度をチェック</p>
        <p className="mt-1 text-sm text-accent-700">6つの質問であなたのFIREグレードを判定</p>
        <Link href="/diagnose/" className="mt-3 inline-block rounded-lg bg-accent-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-700">
          約1分でFIRE診断
        </Link>
      </div>

      <section className="mt-10">
        <Disclaimer />
      </section>
    </div>
  );
}
