import { Metadata } from "next";
import Link from "next/link";
import {
  longtailPages,
  getLongtailPageBySlug,
} from "@/data/longtail-pages";
import {
  estimateMonthlyExpense,
  calcFireNumber,
  calcAchievementYears,
} from "@/lib/calculator";
import {
  FAMILY_COEFFICIENTS,
  estimatePostFireMonthlyCost,
} from "@/config/assumptions";
import { formatMoney } from "@/lib/format";
import { SITE_URL, CONTENT_PUBLISHED_DATE } from "@/config/site";
import { INCOME_LEVELS as TAKE_HOME_LEVELS } from "@/lib/income-tax";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";

/* ---------- types ---------- */

interface FamilyResult {
  familyKey: string;
  familyLabel: string;
  tokyoFireNumber: number;
  nationalFireNumber: number;
  tokyoAchievementAge: number | null;
  nationalAchievementAge: number | null;
}

/* ---------- calculation helpers ---------- */

const FAMILY_KEYS = ["single", "couple", "couple-1child"] as const;
const SWR = 0.04;
const ANNUAL_RETURN = 0.05;
const INFLATION = 0.01;
const TOKYO_COST_INDEX = 1.25;
const NATIONAL_COST_INDEX = 1.0;

function calcForCombination(
  age: number,
  annualIncome: number,
  costIndex: number,
  familyKey: string,
): {
  fireNumber: number;
  achievementAge: number | null;
} {
  const monthlyExpense = estimateMonthlyExpense(costIndex, familyKey, "rent");
  const postFireCost = estimatePostFireMonthlyCost(familyKey);
  const totalMonthly = monthlyExpense + postFireCost;
  const annualExpense = totalMonthly * 12;
  const fireNumber = calcFireNumber(annualExpense, SWR);

  const currentAssets = annualIncome * 0.5;
  const monthlyInvestment = Math.round((annualIncome / 12) * 0.2 * 10) / 10;
  const annualInvestment = monthlyInvestment * 12;

  const { years } = calcAchievementYears(
    currentAssets,
    annualInvestment,
    ANNUAL_RETURN,
    fireNumber,
    INFLATION,
  );

  return {
    fireNumber: Math.round(fireNumber),
    achievementAge: years !== null ? age + years : null,
  };
}

function calcAllFamilyResults(
  age: number,
  annualIncome: number,
): FamilyResult[] {
  return FAMILY_KEYS.map((familyKey) => {
    const tokyo = calcForCombination(age, annualIncome, TOKYO_COST_INDEX, familyKey);
    const national = calcForCombination(age, annualIncome, NATIONAL_COST_INDEX, familyKey);
    const familyLabel =
      FAMILY_COEFFICIENTS[familyKey]?.label ?? familyKey;

    return {
      familyKey,
      familyLabel,
      tokyoFireNumber: tokyo.fireNumber,
      nationalFireNumber: national.fireNumber,
      tokyoAchievementAge: tokyo.achievementAge,
      nationalAchievementAge: national.achievementAge,
    };
  });
}

function generateInsights(
  ageLabel: string,
  age: number,
  annualIncome: number,
  results: FamilyResult[],
): string[] {
  const insights: string[] = [];

  const singleNational = results.find((r) => r.familyKey === "single");
  if (singleNational) {
    if (singleNational.nationalAchievementAge !== null) {
      const yearsNeeded = singleNational.nationalAchievementAge - age;
      insights.push(
        `${ageLabel}・年収${annualIncome}万円の独身の場合、全国平均の生活費水準で約${yearsNeeded}年（${singleNational.nationalAchievementAge}歳）でFIRE達成が見込めます。`,
      );
    } else {
      insights.push(
        `${ageLabel}・年収${annualIncome}万円の独身の場合、貯蓄率20%ではFIRE達成に長い期間が必要です。貯蓄率の引き上げや副収入を検討しましょう。`,
      );
    }
  }

  const tokyoSingle = results.find((r) => r.familyKey === "single");
  if (tokyoSingle && singleNational) {
    const diff = tokyoSingle.tokyoFireNumber - singleNational.nationalFireNumber;
    insights.push(
      `東京在住の場合、全国平均と比べてFIRE必要資産が約${formatMoney(diff)}多くなります。地方移住も選択肢の一つです。`,
    );
  }

  if (annualIncome >= 700) {
    insights.push(
      `年収${annualIncome}万円であれば手取りに余裕があるため、貯蓄率を30%以上に引き上げることでFIRE達成を大幅に前倒しできます。`,
    );
  } else if (annualIncome <= 400) {
    insights.push(
      `年収${annualIncome}万円からのFIRE達成には、支出の最適化が鍵です。固定費の見直しや格安SIM・ふるさと納税の活用で月2〜3万円の削減を目指しましょう。`,
    );
  } else {
    insights.push(
      `年収${annualIncome}万円の場合、新NISA（つみたて投資枠 + 成長投資枠）をフル活用することで、非課税メリットを最大限に享受できます。`,
    );
  }

  if (age <= 30) {
    insights.push(
      `${ageLabel}は複利効果を最大限に活かせる時期です。早期に投資を始めるほど、時間を味方につけて資産を大きく成長させられます。`,
    );
  } else if (age >= 50) {
    insights.push(
      `${ageLabel}からのFIREは退職金・企業年金も計算に入れることで、必要な追加資産を減らせます。サイドFIRE（セミリタイア）も現実的な選択肢です。`,
    );
  } else {
    insights.push(
      `${ageLabel}はキャリアの転換期。転職や副業で年収アップを狙いつつ、生活水準を上げすぎないことがFIRE達成の近道です。`,
    );
  }

  return insights;
}

/* ---------- static params ---------- */

export function generateStaticParams() {
  return longtailPages.map((p) => ({ slug: p.slug }));
}

/* ---------- metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLongtailPageBySlug(slug);
  if (!page) return { title: "プランが見つかりません" };

  return {
    title: `${page.title} | 家族構成・地域別シミュレーション`,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: `/plan/${slug}/`,
      siteName: "FIREシミュレーター",
    },
  };
}

/* ---------- page component ---------- */

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLongtailPageBySlug(slug);
  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p>プランが見つかりません</p>
      </div>
    );
  }

  const results = calcAllFamilyResults(page.age, page.annualIncome);
  const insights = generateInsights(
    page.ageLabel,
    page.age,
    page.annualIncome,
    results,
  );

  const monthlyInvestment = Math.round((page.annualIncome / 12) * 0.2 * 10) / 10;
  const currentAssets = page.annualIncome * 0.5;

  const simParams = new URLSearchParams({
    pref: "tokyo",
    income: String(page.annualIncome),
    age: String(page.age),
    family: "single",
    housing: "rent",
    assets: String(currentAssets),
    invest: String(monthlyInvestment),
  });

  // Related pages: same age, different incomes
  const sameAgePages = longtailPages.filter(
    (p) => p.ageLabel === page.ageLabel && p.slug !== page.slug,
  );
  // Related pages: same income, different ages
  const sameIncomePages = longtailPages.filter(
    (p) => p.annualIncome === page.annualIncome && p.slug !== page.slug,
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/plan/${slug}/` },
    url: `${SITE_URL}/plan/${slug}/`,
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
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
      },
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={structuredData} />

      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "プラン一覧", href: "/plan/" },
          { label: page.title },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {page.title}
      </h1>
      <p className="mt-3 text-gray-600">
        {page.ageLabel}で年収{page.annualIncome}万円の方がFIREを目指す場合、
        どれくらいの資産が必要で何歳で達成できるのかを、家族構成別・地域別にシミュレーションしました。
        貯蓄率20%・想定利回り年5%・インフレ率1%・SWR 4%で計算しています。
      </p>

      {/* Assumptions summary */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">開始年齢</p>
          <p className="mt-1 text-lg font-bold text-gray-800">{page.age}歳</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">年収（額面）</p>
          <p className="mt-1 text-lg font-bold text-gray-800">
            {TAKE_HOME_LEVELS.includes(page.annualIncome as (typeof TAKE_HOME_LEVELS)[number]) ? (
              <Link href={`/income/${page.annualIncome}/`} className="text-primary-700 hover:underline">
                {page.annualIncome}万円
              </Link>
            ) : (
              <>{page.annualIncome}万円</>
            )}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">毎月の積立</p>
          <p className="mt-1 text-lg font-bold text-gray-800">
            {monthlyInvestment}万円
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
          <p className="text-xs text-gray-500">初期資産</p>
          <p className="mt-1 text-lg font-bold text-gray-800">
            {formatMoney(currentAssets)}
          </p>
        </div>
      </div>

      {/* Results table */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          家族構成別×地域別 FIRE必要資産・達成年齢
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm" aria-label={`${page.ageLabel}・年収${page.annualIncome}万円の家族構成別×地域別FIRE比較`}>
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-3 py-3 text-left font-medium text-gray-600">
                  家族構成
                </th>
                <th className="px-3 py-3 text-right font-medium text-gray-600">
                  東京 FIRE資産
                </th>
                <th className="px-3 py-3 text-right font-medium text-gray-600">
                  全国平均 FIRE資産
                </th>
                <th className="px-3 py-3 text-right font-medium text-gray-600">
                  東京 達成年齢
                </th>
                <th className="px-3 py-3 text-right font-medium text-gray-600">
                  全国平均 達成年齢
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((r) => (
                <tr key={r.familyKey} className="hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium text-gray-800">
                    {r.familyLabel}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-700">
                    {formatMoney(r.tokyoFireNumber)}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-700">
                    {formatMoney(r.nationalFireNumber)}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-primary-700">
                    {r.tokyoAchievementAge !== null
                      ? `${r.tokyoAchievementAge}歳`
                      : "ー"}
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-primary-700">
                    {r.nationalAchievementAge !== null
                      ? `${r.nationalAchievementAge}歳`
                      : "ー"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          ※想定利回り年5%、インフレ率1%、SWR 4%、貯蓄率20%、賃貸住まいで計算。初期資産は年収の50%を想定。
        </p>
      </section>

      {/* Insights */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          {page.ageLabel}・年収{page.annualIncome}万円のFIREポイント
        </h2>
        <ul className="mt-4 space-y-3">
          {insights.map((insight, i) => (
            <li
              key={insight}
              className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {i + 1}
              </span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
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
          シミュレーション開始
        </Link>
      </div>

      {/* Related: same age, different income */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-gray-800">
          {page.ageLabel}の他の年収プラン
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sameAgePages.map((related) => {
            const nationalSingle = calcForCombination(
              related.age,
              related.annualIncome,
              NATIONAL_COST_INDEX,
              "single",
            );
            return (
              <Link
                key={related.slug}
                href={`/plan/${related.slug}/`}
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                <p className="font-bold text-gray-800">
                  年収{related.annualIncome}万円
                </p>
                <p className="mt-1 text-sm text-primary-600">
                  必要資産 {formatMoney(nationalSingle.fireNumber)}
                  {nationalSingle.achievementAge !== null &&
                    ` / ${nationalSingle.achievementAge}歳達成`}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Related: same income, different age */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-800">
          年収{page.annualIncome}万円の他の年代プラン
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sameIncomePages.map((related) => {
            const nationalSingle = calcForCombination(
              related.age,
              related.annualIncome,
              NATIONAL_COST_INDEX,
              "single",
            );
            return (
              <Link
                key={related.slug}
                href={`/plan/${related.slug}/`}
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                <p className="font-bold text-gray-800">{related.ageLabel}</p>
                <p className="mt-1 text-sm text-primary-600">
                  必要資産 {formatMoney(nationalSingle.fireNumber)}
                  {nationalSingle.achievementAge !== null &&
                    ` / ${nationalSingle.achievementAge}歳達成`}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
