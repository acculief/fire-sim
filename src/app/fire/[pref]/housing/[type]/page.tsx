import { Metadata } from "next";
import Link from "next/link";
import { prefectures, getPrefectureByCode } from "@/data/prefectures";
import { HOUSING_TYPES_FOR_SEO, HOUSING_COEFFICIENTS } from "@/config/assumptions";
import { generateHousingCases, generateHousingComparison } from "@/lib/seo-helpers";
import { formatMoney } from "@/lib/format";
import FAQ, { getDefaultFAQ } from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedGuides from "@/components/RelatedGuides";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, CONTENT_PUBLISHED_DATE } from "@/config/site";

export function generateStaticParams() {
  const params: { pref: string; type: string }[] = [];
  for (const p of prefectures) {
    for (const ht of HOUSING_TYPES_FOR_SEO) {
      params.push({ pref: p.code, type: ht.key });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pref: string; type: string }>;
}): Promise<Metadata> {
  const { pref, type } = await params;
  const prefecture = getPrefectureByCode(pref);
  const name = prefecture?.name ?? pref;
  const housingLabel = HOUSING_COEFFICIENTS[type]?.label ?? type;
  const title = `${name}・${housingLabel}のFIREシミュレーション`;
  const description = `${name}在住・${housingLabel}の方のFIRE必要資産と達成年を年収別にシミュレーション。住宅タイプ別の戦略も解説。`;
  return {
    title,
    description,
    alternates: { canonical: `/fire/${pref}/housing/${type}/` },
    openGraph: { title, description, url: `/fire/${pref}/housing/${type}/` },
  };
}

export default async function HousingPage({
  params,
}: {
  params: Promise<{ pref: string; type: string }>;
}) {
  const { pref, type } = await params;
  const prefecture = getPrefectureByCode(pref);
  const housingLabel = HOUSING_COEFFICIENTS[type]?.label ?? type;
  const housingCoeff = HOUSING_COEFFICIENTS[type]?.coefficient ?? 1.0;
  if (!prefecture) return <div>地域が見つかりません</div>;

  const cases = generateHousingCases(pref, type);
  const comparison = generateHousingComparison(pref, 500);
  const faqItems = getDefaultFAQ(prefecture.name);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${prefecture.name}・${housingLabel}のFIREシミュレーション`,
          url: `${SITE_URL}/fire/${pref}/housing/${type}/`,
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
          { label: housingLabel },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {prefecture.name}・{housingLabel}のFIREシミュレーション
      </h1>
      <p className="mt-2 text-gray-600">
        {prefecture.name}（生活費係数{prefecture.costIndex}）で{housingLabel}
        の場合のFIREシミュレーション結果です。住宅係数は
        <strong>{housingCoeff}</strong>で、
        {housingCoeff < 1.0
          ? "住居費がかからない分、月間生活費が抑えられます。"
          : housingCoeff === 1.0
            ? "一般的な賃貸住まいの生活費水準です。"
            : "住宅ローンの支払いにより、やや高めの生活費になります。"}
      </p>

      <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
        <Link
          href={`/simulate/?pref=${pref}&housing=${type}`}
          className="btn-primary inline-block"
        >
          自分の条件で詳細シミュレーション
        </Link>
      </div>

      {/* 年収別比較表 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">年収別の比較</h2>
        <p className="mt-1 text-sm text-gray-500">
          30歳開始、資産300万円、月10万円積立、利回り4%、SWR4%、{housingLabel}の場合
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${prefecture.name}・${housingLabel}の年収別比較`}>
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

      {/* 住宅タイプ間ミニ比較 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          住宅タイプ別の比較（年収500万円の場合）
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {prefecture.name}・年収500万円・独身・30歳開始の場合
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${prefecture.name}の住宅タイプ別比較`}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="px-3 py-2 text-left font-medium text-gray-600">住宅タイプ</th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">住宅係数</th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">月間生活費</th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">必要資産</th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">達成年齢</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparison.map((c) => (
                <tr
                  key={c.housingType}
                  className={c.housingType === type ? "bg-primary-50" : ""}
                >
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {c.housingType === type ? (
                      <span className="text-primary-700">{c.label}</span>
                    ) : (
                      <Link
                        href={`/fire/${pref}/housing/${c.housingType}/`}
                        className="text-primary-600 hover:underline"
                      >
                        {c.label}
                      </Link>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">{c.coefficient}</td>
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

      {/* 住宅戦略解説 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {housingLabel}のFIRE戦略
        </h2>
        <div className="mt-3 space-y-3 text-gray-600">
          {type === "rent" && (
            <>
              <p>
                賃貸住まいは<strong>初期費用を抑え、住み替えの柔軟性</strong>が最大のメリットです。
                FIRE達成後に生活費の低い地域へ移住するなど、
                ライフステージに合わせた住み替え戦略が取れます。
              </p>
              <p>
                {prefecture.name}では
                {prefecture.costIndex >= 1.1
                  ? "家賃が高い分、生活費全体に占める住居費の割合が大きくなります。FIRE後の地方移住で生活費を大幅に削減できる可能性があります。"
                  : "比較的家賃が抑えられるため、賃貸のまま投資に資金を回す戦略が有効です。"}
              </p>
            </>
          )}
          {type === "own" && (
            <>
              <p>
                持ち家（ローン完済）は<strong>住居費ゼロ</strong>という大きなアドバンテージがあり、
                FIRE後の月間支出を大幅に抑えられます。
                必要資産が少なくなるため、FIRE達成が早まる可能性があります。
              </p>
              <p>
                {prefecture.name}では
                {prefecture.costIndex >= 1.1
                  ? "高い家賃相場を考えると、ローン完済後の住居費ゼロのメリットが特に大きくなります。"
                  : "もともと住居費が低めの地域なので、持ち家のメリットは都市部ほど大きくありませんが、固定費削減効果は確実です。"}
              </p>
            </>
          )}
          {type === "own_loan" && (
            <>
              <p>
                持ち家（ローン有）は<strong>資産形成と住居費の二重負担</strong>がFIRE達成のハードルになりますが、
                ローン完済後は住居費がゼロになるため長期的にはメリットがあります。
              </p>
              <p>
                {prefecture.name}では
                {prefecture.costIndex >= 1.1
                  ? "物件価格が高い分ローン負担も大きくなります。繰上返済と投資のバランスが重要な戦略ポイントです。"
                  : "物件価格が比較的抑えられるため、ローン返済と投資の両立がしやすい環境です。"}
              </p>
            </>
          )}
        </div>
      </section>

      {/* 他の住宅タイプへのリンク */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name}の他の住宅タイプ
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {HOUSING_TYPES_FOR_SEO.filter((ht) => ht.key !== type).map((ht) => (
            <Link
              key={ht.key}
              href={`/fire/${pref}/housing/${ht.key}/`}
              className="tag-link"
            >
              {ht.label}
            </Link>
          ))}
        </div>
      </section>

      <RelatedGuides category="housing" />

      <section className="mt-10">
        <FAQ items={faqItems} prefName={prefecture.name} />
      </section>

      <section className="mt-8 text-center">
        <Link
          href={`/simulate/?pref=${pref}&housing=${type}`}
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
