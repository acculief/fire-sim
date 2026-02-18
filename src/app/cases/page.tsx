import { Metadata } from "next";
import Link from "next/link";
import { modelCases } from "@/data/model-cases";
import { formatMoney } from "@/lib/format";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedContent from "@/components/RelatedContent";

export const metadata: Metadata = {
  title: "年代別FIREモデルケース | 必要資産・達成年シミュレーション",
  description:
    "30代独身・40代子あり・50代夫婦など、年代・家族構成・地域別のFIREモデルケースを紹介。必要資産額と達成年齢をシミュレーション。",
  openGraph: {
    title: "年代別FIREモデルケース | 必要資産・達成年シミュレーション",
    description:
      "30代独身・40代子あり・50代夫婦など、年代・家族構成・地域別のFIREモデルケースを紹介。必要資産額と達成年齢をシミュレーション。",
  },
};

export default function CasesIndexPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "年代別FIREモデルケース",
    description:
      "30代独身・40代子あり・50代夫婦など、年代・家族構成・地域別のFIREモデルケースを紹介",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: modelCases.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/cases/${c.slug}/`,
        name: c.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "モデルケース" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        年代別FIREモデルケース
      </h1>
      <p className="mt-2 text-gray-600">
        年齢・年収・家族構成・居住地域が異なる5つの代表的なケースで、FIRE達成に必要な資産額や達成年齢をシミュレーション。
        あなたに近い条件のケースを参考に、FIREプランの目安をつかみましょう。
      </p>

      <div className="mt-8 space-y-4">
        {modelCases.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}/`}
            className="block rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <h2 className="text-lg font-bold text-gray-800">{c.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{c.subtitle}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="text-gray-500">
                FIRE必要資産{" "}
                <span className="font-bold text-primary-700">
                  {formatMoney(c.fireNumber)}
                </span>
              </span>
              <span className="text-gray-500">
                達成年齢{" "}
                <span className="font-bold text-primary-700">
                  {c.achievementAge !== null ? `${c.achievementAge}歳` : "ー"}
                </span>
              </span>
              <span className="text-gray-500">
                月間生活費{" "}
                <span className="font-bold text-gray-700">
                  {c.monthlyExpense}万円
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <RelatedContent
        items={[
          { href: "/guide/fire-first-steps/", title: "FIRE達成の第一歩", description: "具体的なアクションプランを解説" },
          { href: "/guide/fire-savings-rate/", title: "貯蓄率とFIRE達成年", description: "貯蓄率がFIRE達成を左右する理由" },
          { href: "/diagnose/", title: "30秒でFIRE診断", description: "あなたのFIREグレードを判定" },
          { href: "/plan/", title: "年収×年代別プラン", description: "年収帯ごとのFIRE達成プランを確認" },
        ]}
      />

      {/* CTA */}
      <div className="mt-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          自分の条件で計算してみましょう
        </p>
        <p className="mt-1 text-sm text-primary-700">
          地域・年収・家族構成を入力して、あなただけのFIREプランをシミュレーション
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
