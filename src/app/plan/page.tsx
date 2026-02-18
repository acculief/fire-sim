import { Metadata } from "next";
import Link from "next/link";
import { longtailPages } from "@/data/longtail-pages";
import { formatMoney } from "@/lib/format";
import { estimateMonthlyExpense, calcFireNumber } from "@/lib/calculator";
import { estimatePostFireMonthlyCost } from "@/config/assumptions";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RelatedContent from "@/components/RelatedContent";

export const metadata: Metadata = {
  title: "年収×年代別 FIREプラン一覧 | 必要資産シミュレーション",
  description:
    "年収300万〜1000万円、20代〜50代の年代別にFIRE達成に必要な資産額と達成年齢をシミュレーション。あなたに近い条件のプランを確認。",
  openGraph: {
    title: "年収×年代別 FIREプラン一覧 | 必要資産シミュレーション",
    description:
      "年収300万〜1000万円、20代〜50代の年代別にFIRE達成に必要な資産額と達成年齢をシミュレーション。あなたに近い条件のプランを確認。",
  },
};

const AGE_GROUP_ORDER = ["20代", "30代", "40代", "50代"] as const;

function getQuickFireNumber(annualIncome: number): number {
  const costIndex = 1.0;
  const monthlyExpense = estimateMonthlyExpense(costIndex, "single", "rent");
  const postFireCost = estimatePostFireMonthlyCost("single");
  const totalMonthly = monthlyExpense + postFireCost;
  const annualExpense = totalMonthly * 12;
  return calcFireNumber(annualExpense, 0.04);
}

export default function PlanIndexPage() {
  const grouped = AGE_GROUP_ORDER.map((ageLabel) => ({
    ageLabel,
    pages: longtailPages.filter((p) => p.ageLabel === ageLabel),
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "年収×年代別 FIREプラン一覧",
    description:
      "年収300万〜1000万円、20代〜50代の年代別にFIRE達成に必要な資産額と達成年齢をシミュレーション",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: longtailPages.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/plan/${p.slug}/`,
        name: p.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={structuredData} />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "プラン一覧" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        年収×年代別 FIREプラン一覧
      </h1>
      <p className="mt-2 text-gray-600">
        年収と年代の組み合わせごとに、FIRE達成に必要な資産額と達成年齢をシミュレーション。
        あなたに近い条件のプランを見つけて、FIREへの道筋を確認しましょう。
      </p>

      {grouped.map((group) => (
        <section key={group.ageLabel} className="mt-10">
          <h2 className="text-xl font-bold text-gray-800">
            {group.ageLabel}のFIREプラン
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.pages.map((page) => {
              const fireNumber = getQuickFireNumber(page.annualIncome);
              return (
                <Link
                  key={page.slug}
                  href={`/plan/${page.slug}/`}
                  className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
                >
                  <h3 className="font-bold text-gray-800">
                    年収{page.annualIncome}万円
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    FIRE必要資産（独身・全国平均）
                  </p>
                  <p className="text-lg font-bold text-primary-700">
                    {formatMoney(Math.round(fireNumber))}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <RelatedContent
        items={[
          { href: "/cases/", title: "モデルケース", description: "実例で学ぶFIRE達成プラン" },
          { href: "/income/", title: "手取り早見表", description: "年収別の手取り額・税金を確認" },
          { href: "/guide/nisa-ideco-for-fire/", title: "NISA・iDeCo活用法", description: "税制優遇をフル活用する戦略" },
          { href: "/diagnose/", title: "30秒でFIRE診断", description: "あなたのFIREグレードを判定" },
        ]}
      />

      <div className="mt-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          自分の条件で詳しく計算する
        </p>
        <p className="mt-1 text-sm text-primary-700">
          地域・年収・家族構成を自由に設定して、あなただけのFIREプランをシミュレーション
        </p>
        <Link
          href="/simulate/"
          className="btn-primary mt-4 inline-block text-lg"
        >
          シミュレーション開始
        </Link>
      </div>
    </div>
  );
}
