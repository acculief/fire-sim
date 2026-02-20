import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, CONTENT_PUBLISHED_DATE } from "@/config/site";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RelatedContent from "@/components/RelatedContent";
import {
  INCOME_LEVELS,
  FAMILY_PATTERNS,
  getFamilyLabel,
  calcTakeHome,
} from "@/lib/income-tax";

export const metadata: Metadata = {
  title: "年収別 手取り早見表 | 200万〜2,000万円の税金・社会保険料",
  description:
    "年収200万〜2,000万円の手取り額を一覧表で確認。所得税・住民税・社会保険料の内訳と、独身・夫婦・子ありの家族構成別で比較できます。",
  alternates: { canonical: "/income/" },
  openGraph: {
    title: "年収別 手取り早見表",
    description:
      "年収200万〜2,000万円の手取り額・税金・社会保険料を一覧表で比較。家族構成別の違いも。",
    type: "article",
    url: "/income/",
    siteName: "FIREシミュレーター",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

function man(value: number): string {
  const m = Math.round(value / 10_000);
  return m.toLocaleString() + "万円";
}

export default function IncomePage() {
  const rows = INCOME_LEVELS.map((level) => {
    const gross = level * 10_000;
    return {
      level,
      single: calcTakeHome(gross, "single"),
      couple: calcTakeHome(gross, "couple"),
      "couple-child1": calcTakeHome(gross, "couple-child1"),
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "年収別 手取り早見表",
    description:
      "年収200万〜2,000万円の手取り額・税金・社会保険料を一覧で確認。家族構成別の比較も。",
    url: `${SITE_URL}/income/`,
    image: `${SITE_URL}/opengraph-image`,
    datePublished: CONTENT_PUBLISHED_DATE,
    inLanguage: "ja",
    author: {
      "@type": "Organization",
      name: "FIREシミュレーター",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "FIREシミュレーター",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <JsonLd data={jsonLd} />

      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "手取り早見表" }]} />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        年収別 手取り早見表
      </h1>
      <p className="mt-3 text-gray-600">
        年収200万〜2,000万円の手取り額を、税金（所得税・住民税）と社会保険料の内訳付きで一覧表にまとめました。
        家族構成による手取りの違いも比較できます。
      </p>
      <p className="mt-2 text-xs text-gray-600">
        ※{new Date().getFullYear()}年の税制に基づく簡易計算。40歳未満・給与収入のみ・協会けんぽ加入を想定。
      </p>

      {/* ---------- メイン早見表（独身） ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          手取り額一覧（独身・扶養なしの場合）
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm" aria-label="年収別 手取り額一覧（独身・扶養なし）">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-600">年収</th>
                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-600">手取り（年額）</th>
                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-600">手取り（月額）</th>
                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-600">所得税</th>
                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-600">住民税</th>
                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-600">社会保険料</th>
                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-600">手取り率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.level} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/income/${row.level}/`}
                      className="font-medium text-primary-700 hover:underline"
                    >
                      {row.level.toLocaleString()}万円
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-800">
                    {man(row.single.takeHomeAnnual)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-700">
                    {man(row.single.takeHomeMonthly)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-600">
                    {man(row.single.incomeTax)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-600">
                    {man(row.single.residentTax)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-600">
                    {man(row.single.socialInsurance.total)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-500">
                    {row.single.takeHomeRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- 家族構成別比較 ---------- */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">
          家族構成別の手取り比較
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          配偶者控除・扶養控除の適用により、同じ年収でも家族構成によって手取りが変わります。
          片働き夫婦は配偶者控除（38万円）、子1人は一般扶養控除（38万円、16歳以上）を加算。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm" aria-label="家族構成別の手取り比較">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-600">年収</th>
                {FAMILY_PATTERNS.map((f) => (
                  <th key={f} scope="col" className="px-3 py-3 text-right font-medium text-gray-600">
                    {getFamilyLabel(f)}
                  </th>
                ))}
                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-600">
                  夫婦+子の増額
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const diff =
                  row["couple-child1"].takeHomeAnnual - row.single.takeHomeAnnual;
                return (
                  <tr key={row.level} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/income/${row.level}/`}
                        className="font-medium text-primary-700 hover:underline"
                      >
                        {row.level.toLocaleString()}万円
                      </Link>
                    </td>
                    {FAMILY_PATTERNS.map((f) => (
                      <td key={f} className="px-3 py-2.5 text-right text-gray-700">
                        {man(row[f].takeHomeAnnual)}
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-right font-medium text-green-600">
                      +{man(diff)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- 計算方法 ---------- */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">手取りの計算方法</h2>
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="font-bold text-gray-800">手取り ＝ 年収 − 社会保険料 − 所得税 − 住民税</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800">1. 社会保険料（従業員負担分）</h3>
            <ul className="mt-1 ml-4 list-disc space-y-1 text-gray-600">
              <li>健康保険料: 約5.0%（協会けんぽ全国平均）</li>
              <li>厚生年金保険料: 9.15%（上限: 標準報酬月額65万円）</li>
              <li>雇用保険料: 0.6%</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800">2. 所得税</h3>
            <p className="mt-1 text-gray-600">
              給与所得控除・基礎控除・社会保険料控除を差し引いた課税所得に、
              累進税率（5%〜45%）を適用。復興特別所得税2.1%を加算。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800">3. 住民税</h3>
            <p className="mt-1 text-gray-600">
              課税所得の10%（所得割）＋ 均等割 5,000円。
              住民税の基礎控除は43万円（所得税の48万円と異なる）。
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FIRE接続CTA ---------- */}
      <section className="mt-12">
        <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
          <h2 className="text-lg font-bold text-primary-800">
            あなたの手取りでFIREできる？
          </h2>
          <p className="mt-2 text-sm text-primary-700">
            手取り額がわかったら、次は「何歳でFIREできるか」をシミュレーション。
            地域・家族構成・投資条件を入れて、FIRE達成年を計算しましょう。
          </p>
          <Link
            href="/simulate/"
            className="btn-primary mt-4 inline-block text-lg"
          >
            FIREシミュレーションを試す
          </Link>
        </div>
      </section>

      {/* ---------- 個別ページへのリンク ---------- */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900">
          年収別の詳細ページ
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          各年収の詳しい内訳（社会保険料の明細・家族構成別比較・FIRE目安）を確認できます。
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {INCOME_LEVELS.map((level) => (
            <Link
              key={level}
              href={`/income/${level}/`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {level.toLocaleString()}万円
            </Link>
          ))}
        </div>
      </section>

      <RelatedContent
        items={[
          {
            href: "/simulate/",
            title: "FIREシミュレーション",
            description: "地域・年収・家族構成から必要資産と達成年を計算",
          },
          {
            href: "/guide/fire-tax-optimization/",
            title: "FIRE志向者の節税戦略",
            description: "手取りを最大化して資産形成を加速する方法",
          },
          {
            href: "/recommend/",
            title: "おすすめ証券口座",
            description: "FIRE達成に最適な証券口座を比較",
          },
          {
            href: "/diagnose/",
            title: "FIRE達成度診断",
            description: "6つの質問であなたのFIREグレードを判定",
          },
        ]}
      />

      {/* ---------- 注意事項 ---------- */}
      <div className="mt-12 rounded-lg bg-gray-100 p-4 text-xs text-gray-600">
        <p className="font-medium">計算の前提・注意事項</p>
        <ul className="mt-1 ml-4 list-disc space-y-0.5">
          <li>{new Date().getFullYear()}年の税制に基づく概算値です</li>
          <li>40歳未満（介護保険料なし）、給与収入のみを想定</li>
          <li>健康保険は協会けんぽ全国平均（約5.0%）で計算</li>
          <li>配偶者は年収103万円以下（配偶者控除適用）、子は16歳以上（一般扶養控除適用）を想定</li>
          <li>ふるさと納税・iDeCo・住宅ローン控除等の個別控除は含まれていません</li>
          <li>実際の手取りは勤務先の保険組合や自治体により異なります</li>
        </ul>
      </div>
    </div>
  );
}
