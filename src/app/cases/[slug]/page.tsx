import { Metadata } from "next";
import Link from "next/link";
import { modelCases, getModelCaseBySlug, type ModelCase } from "@/data/model-cases";
import { FAMILY_COEFFICIENTS, HOUSING_COEFFICIENTS } from "@/config/assumptions";
import { SITE_URL, CONTENT_PUBLISHED_DATE } from "@/config/site";
import { formatMoney } from "@/lib/format";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";

/* ------------------------------------------------------------------ */
/*  ケース特性に応じたガイド記事選択                                       */
/* ------------------------------------------------------------------ */

interface GuideLink {
  href: string;
  title: string;
  description: string;
}

function getRelatedGuides(c: ModelCase): GuideLink[] {
  const guides: GuideLink[] = [];

  // 年代別ガイド
  if (c.age < 40) {
    guides.push({
      href: "/guide/fire-by-age-30/",
      title: "30代からのFIRE計画",
      description: "年収別の達成シミュレーション",
    });
  } else if (c.age < 50) {
    guides.push({
      href: "/guide/fire-by-age-40/",
      title: "40代からのFIRE計画",
      description: "遅くない！現実的な資産形成ロードマップ",
    });
  } else {
    guides.push({
      href: "/guide/fire-and-pension/",
      title: "FIREと年金の関係",
      description: "早期退職後の年金への影響を解説",
    });
  }

  // 家族構成別ガイド
  if (c.familyType === "couple") {
    guides.push({
      href: "/guide/fire-couple-strategy/",
      title: "共働き夫婦のFIRE最速プラン",
      description: "2馬力を最大限活かす資産形成戦略",
    });
  } else if (c.familyType.includes("child")) {
    guides.push({
      href: "/guide/fire-with-family/",
      title: "家族持ちのFIRE戦略",
      description: "夫婦・子育て世帯のFIRE計画ガイド",
    });
  }

  // サイドFIRE関連（slugにsidefireが含まれる場合）
  if (c.slug.includes("sidefire")) {
    guides.push({
      href: "/guide/side-fire/",
      title: "サイドFIREとは？",
      description: "必要資産・始め方・向いている人を解説",
    });
  }

  // 地域差が大きいケース
  if (c.prefecture !== "tokyo") {
    guides.push({
      href: "/guide/fire-by-region/",
      title: "地域別FIRE戦略",
      description: "東京vs地方、住む場所で達成年はこう変わる",
    });
  }

  // 共通ガイド（4件になるまで追加）
  const universal: GuideLink[] = [
    {
      href: "/guide/nisa-fire-acceleration/",
      title: "新NISAでFIRE達成を加速",
      description: "非課税枠の活用で2〜3年短縮",
    },
    {
      href: "/guide/fire-index-investing/",
      title: "インデックス投資入門",
      description: "銘柄選びから出口戦略まで",
    },
    {
      href: "/guide/how-to-choose-broker/",
      title: "ネット証券口座の選び方",
      description: "主要6社比較＆タイプ別おすすめ",
    },
    {
      href: "/guide/fire-first-steps/",
      title: "FIRE初心者がやるべき3つのこと",
      description: "家計把握・口座開設・投資開始の3ステップ",
    },
  ];

  const existingHrefs = new Set(guides.map((g) => g.href));
  for (const g of universal) {
    if (guides.length >= 4) break;
    if (!existingHrefs.has(g.href)) {
      guides.push(g);
    }
  }

  return guides.slice(0, 4);
}

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
          {getRelatedGuides(c).map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="link-card"
            >
              <p className="font-bold text-gray-800">{guide.title}</p>
              <p className="mt-1 text-xs text-gray-600">{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FIRE診断CTA */}
      <div className="mt-8 rounded-lg border border-accent-200 bg-accent-50 p-6 text-center">
        <p className="font-bold text-accent-800">
          あなたのFIRE達成度をチェックしよう
        </p>
        <p className="mt-1 text-sm text-accent-700">
          6つの質問に答えるだけで、FIREグレードと達成予測年齢がわかります
        </p>
        <Link
          href="/diagnose/"
          className="mt-3 inline-block rounded-lg bg-accent-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-700"
        >
          約1分でFIRE診断
        </Link>
      </div>

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
                className="link-card"
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
