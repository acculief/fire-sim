import { Metadata } from "next";
import Link from "next/link";
import { prefectures, getPrefectureByCode } from "@/data/prefectures";
import { HOUSING_TYPES_FOR_SEO, HOUSING_COEFFICIENTS } from "@/config/assumptions";
import { generateHousingCases, generateHousingComparison } from "@/lib/seo-helpers";
import { formatMoney } from "@/lib/format";
import FAQ, { getDefaultFAQ } from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";

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
  return {
    title: `${name}・${housingLabel}のFIREシミュレーション`,
    description: `${name}在住・${housingLabel}の方のFIRE必要資産と達成年を年収別にシミュレーション。住宅タイプ別の戦略も解説。`,
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600">年収</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">月間生活費</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">必要資産</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">達成年齢</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map((c, i) => (
                <tr key={i}>
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600">住宅タイプ</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">住宅係数</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">月間生活費</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">必要資産</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">達成年齢</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comparison.map((c, i) => (
                <tr
                  key={i}
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
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {ht.label}
            </Link>
          ))}
        </div>
      </section>

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

      <section className="mt-10">
        <Disclaimer />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "ホーム", item: "https://fire-sim-phi.vercel.app/" },
              { "@type": "ListItem", position: 2, name: prefecture.name, item: `https://fire-sim-phi.vercel.app/fire/${pref}/` },
              { "@type": "ListItem", position: 3, name: housingLabel },
            ],
          }),
        }}
      />
    </div>
  );
}
