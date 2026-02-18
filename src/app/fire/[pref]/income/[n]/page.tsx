import { Metadata } from "next";
import Link from "next/link";
import { prefectures, getPrefectureByCode } from "@/data/prefectures";
import { INCOME_LEVELS } from "@/config/assumptions";
import { generateIncomeCases } from "@/lib/seo-helpers";
import { formatMoney } from "@/lib/format";
import FAQ, { getDefaultFAQ } from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";

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
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  家族構成
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

      <section className="mt-10">
        <Disclaimer />
      </section>
    </div>
  );
}
