import { Metadata } from "next";
import Link from "next/link";
import { prefectures, getPrefectureByCode } from "@/data/prefectures";
import { INCOME_LEVELS } from "@/config/assumptions";
import { generateIncomeCases } from "@/lib/seo-helpers";
import { formatMoney } from "@/lib/format";
import FAQ, { getDefaultFAQ } from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedGuides from "@/components/RelatedGuides";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, CONTENT_PUBLISHED_DATE } from "@/config/site";

export function generateStaticParams() {
  const params: { pref: string; n: string }[] = [];
  for (const p of prefectures) {
    for (const il of INCOME_LEVELS) {
      params.push({ pref: p.code, n: String(il.value) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pref: string; n: string }>;
}): Promise<Metadata> {
  const { pref, n } = await params;
  const prefecture = getPrefectureByCode(pref);
  const name = prefecture?.name ?? pref;
  const title = `${name}・年収${n}万円のFIREシミュレーション`;
  const description = `${name}在住・年収${n}万円の方のFIRE必要資産と達成年を家族構成別にシミュレーション。`;
  return {
    title,
    description,
    alternates: { canonical: `/fire/${pref}/income/${n}/` },
    openGraph: { title, description, url: `/fire/${pref}/income/${n}/` },
  };
}

export default async function IncomePage({
  params,
}: {
  params: Promise<{ pref: string; n: string }>;
}) {
  const { pref, n } = await params;
  const prefecture = getPrefectureByCode(pref);
  const income = Number(n);
  if (!prefecture) return <div>地域が見つかりません</div>;

  const cases = generateIncomeCases(pref, income);
  const faqItems = getDefaultFAQ(prefecture.name);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${prefecture.name}・年収${income}万円のFIREシミュレーション`,
          url: `${SITE_URL}/fire/${pref}/income/${n}/`,
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
          { label: `年収${income}万円` },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {prefecture.name}・年収{income}万円のFIREシミュレーション
      </h1>
      <p className="mt-2 text-gray-600">
        {prefecture.name}（生活費係数{prefecture.costIndex}）で年収{income}
        万円の場合、家族構成によってFIRE必要資産と達成年がどう変わるか比較します。
      </p>

      <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
        <Link
          href={`/simulate/?pref=${pref}&income=${income}`}
          className="btn-primary inline-block"
        >
          自分の条件で詳細シミュレーション
        </Link>
      </div>

      {/* 家族構成別比較 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">家族構成別の比較</h2>
        <p className="mt-1 text-sm text-gray-500">
          30歳開始、資産300万円、月10万円積立、利回り4%、SWR4%の場合
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`${prefecture.name}・年収${income}万円の家族構成別比較`}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th scope="col" className="px-3 py-2 text-left font-medium text-gray-600">
                  家族構成
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">
                  月間生活費
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">
                  必要資産
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-gray-600">
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

      {/* 他の年収へのリンク */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {prefecture.name}の他の年収
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {INCOME_LEVELS.filter((il) => il.value !== income).map((il) => (
            <Link
              key={il.value}
              href={`/fire/${pref}/income/${il.value}/`}
              className="tag-link"
            >
              {il.label}
            </Link>
          ))}
        </div>
      </section>

      <RelatedGuides category="income" />

      <section className="mt-10">
        <FAQ items={faqItems} prefName={prefecture.name} />
      </section>

      <section className="mt-8 text-center">
        <Link
          href={`/simulate/?pref=${pref}&income=${income}`}
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
