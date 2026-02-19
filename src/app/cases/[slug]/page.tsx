import { Metadata } from "next";
import Link from "next/link";
import { modelCases, getModelCaseBySlug } from "@/data/model-cases";
import { FAMILY_COEFFICIENTS, HOUSING_COEFFICIENTS } from "@/config/assumptions";
import { SITE_URL, CONTENT_PUBLISHED_DATE } from "@/config/site";
import { formatMoney } from "@/lib/format";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return modelCases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getModelCaseBySlug(slug);
  if (!c) return { title: "ケースが見つかりません" };

  return {
    title: `${c.title}のFIREモデルケース | ${c.subtitle}`,
    description: c.description,
    alternates: { canonical: `/cases/${slug}/` },
    openGraph: {
      title: `${c.title}のFIREモデルケース`,
      description: c.description,
      type: "article",
      url: `/cases/${slug}/`,
      siteName: "FIREシミュレーター",
    },
  };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getModelCaseBySlug(slug);
  if (!c) return <div>ケースが見つかりません</div>;

  const familyLabel =
    FAMILY_COEFFICIENTS[c.familyType]?.label ?? c.familyType;
  const housingLabel =
    HOUSING_COEFFICIENTS[c.housingType]?.label ?? c.housingType;

  const simParams = new URLSearchParams({
    pref: c.prefecture,
    income: String(c.annualIncome),
    age: String(c.age),
    family: c.familyType,
    housing: c.housingType,
    assets: String(c.currentAssets),
    invest: String(c.monthlyInvestment),
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.title}のFIREモデルケース`,
    description: c.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/cases/${slug}/` },
    url: `${SITE_URL}/cases/${slug}/`,
    image: `${SITE_URL}/opengraph-image`,
    datePublished: CONTENT_PUBLISHED_DATE,
    dateModified: CONTENT_PUBLISHED_DATE,
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={structuredData} />

      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "モデルケース", href: "/cases/" },
          { label: c.title },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {c.title}
      </h1>
      <p className="mt-2 text-lg text-gray-600">{c.subtitle}</p>
      <p className="mt-3 text-sm text-gray-500">{c.description}</p>

      {/* 主要数値カード */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
          <p className="text-xs text-primary-600">FIRE必要資産</p>
          <p className="mt-1 text-lg font-bold text-primary-800">
            {formatMoney(c.fireNumber)}
          </p>
        </div>
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
          <p className="text-xs text-primary-600">達成予測年齢</p>
          <p className="mt-1 text-lg font-bold text-primary-800">
            {c.achievementAge !== null ? `${c.achievementAge}歳` : "ー"}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-xs text-gray-600">月間生活費</p>
          <p className="mt-1 text-lg font-bold text-gray-800">
            {c.monthlyExpense}万円
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-xs text-gray-600">年間投資額</p>
          <p className="mt-1 text-lg font-bold text-gray-800">
            {c.monthlyInvestment * 12}万円
          </p>
        </div>
      </div>

      {/* シミュレーション条件 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          シミュレーション条件
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm" aria-label={`${c.title}のシミュレーション条件`}>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-600">
                  年齢
                </td>
                <td className="px-4 py-3 text-gray-800">{c.age}歳</td>
              </tr>
              <tr>
                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-600">
                  年収（額面）
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {c.annualIncome}万円
                </td>
              </tr>
              <tr>
                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-600">
                  居住地
                </td>
                <td className="px-4 py-3 text-gray-800">{c.prefectureName}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-600">
                  家族構成
                </td>
                <td className="px-4 py-3 text-gray-800">{familyLabel}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-600">
                  住居
                </td>
                <td className="px-4 py-3 text-gray-800">{housingLabel}</td>
              </tr>
              <tr>
                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-600">
                  現在の資産
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {formatMoney(c.currentAssets)}
                </td>
              </tr>
              <tr>
                <td className="bg-gray-50 px-4 py-3 font-medium text-gray-600">
                  毎月の積立額
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {c.monthlyInvestment}万円
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          ※想定利回り年5%、インフレ率1%、取り崩し率（SWR）4%で計算
        </p>
      </section>

      {/* ポイント・アドバイス */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          このケースのポイント
        </h2>
        <ul className="mt-4 space-y-3">
          {c.keyPoints.map((point, i) => (
            <li
              key={point}
              className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {i + 1}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA: シミュレーションへ */}
      <div className="mt-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          この条件で詳しくシミュレーションする
        </p>
        <p className="mt-1 text-sm text-primary-700">
          楽観・中立・悲観の3シナリオ比較や感度分析も確認できます
        </p>
        <Link
          href={`/simulate/?${simParams.toString()}`}
          className="btn-primary mt-4 inline-block text-lg"
        >
          この条件でシミュレーション開始
        </Link>
      </div>

      {/* 関連ガイド */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-gray-800">
          関連ガイド記事
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/guide/fire-first-steps/"
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">FIRE初心者が最初にやるべき3つのこと</p>
            <p className="mt-1 text-xs text-gray-600">家計把握・口座開設・投資開始の3ステップ</p>
          </Link>
          <Link
            href="/guide/how-to-choose-broker/"
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">ネット証券口座の選び方</p>
            <p className="mt-1 text-xs text-gray-600">主要6社比較＆タイプ別おすすめ</p>
          </Link>
          <Link
            href="/guide/fire-index-investing/"
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">インデックス投資入門</p>
            <p className="mt-1 text-xs text-gray-600">銘柄選びから出口戦略まで</p>
          </Link>
          <Link
            href="/guide/nisa-fire-acceleration/"
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">新NISAでFIRE達成を加速</p>
            <p className="mt-1 text-xs text-gray-600">非課税枠の活用で2〜3年短縮</p>
          </Link>
        </div>
      </section>

      {/* 他のモデルケース */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-gray-800">
          他のモデルケースを見る
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {modelCases
            .filter((other) => other.slug !== c.slug)
            .map((other) => (
              <Link
                key={other.slug}
                href={`/cases/${other.slug}/`}
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                <p className="font-bold text-gray-800">{other.title}</p>
                <p className="mt-1 text-xs text-gray-600">{other.subtitle}</p>
                <p className="mt-2 text-sm text-primary-600">
                  必要資産 {formatMoney(other.fireNumber)}
                  {other.achievementAge !== null &&
                    ` / ${other.achievementAge}歳達成`}
                </p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
