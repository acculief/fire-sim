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
  type FamilyPattern,
} from "@/lib/income-tax";

/* ---------- static params ---------- */

export function generateStaticParams() {
  return INCOME_LEVELS.map((n) => ({ amount: String(n) }));
}

/* ---------- metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string }>;
}): Promise<Metadata> {
  const { amount } = await params;
  const level = Number(amount);
  const r = calcTakeHome(level * 10_000, "single");
  const takeMan = Math.round(r.takeHomeAnnual / 10_000);

  return {
    title: `年収${level.toLocaleString()}万円の手取りは${takeMan.toLocaleString()}万円｜税金・保険料の内訳`,
    description: `年収${level.toLocaleString()}万円（月収${Math.round(level / 12).toLocaleString()}万円）の手取り額は約${takeMan.toLocaleString()}万円（手取り率${r.takeHomeRate}%）。所得税・住民税・社会保険料の内訳と、家族構成別の比較を掲載。`,
    alternates: { canonical: `/income/${amount}/` },
    openGraph: {
      title: `年収${level.toLocaleString()}万円の手取り額`,
      description: `手取り約${takeMan.toLocaleString()}万円（${r.takeHomeRate}%）。税金・保険料の詳細内訳。`,
      type: "article",
      url: `/income/${amount}/`,
      siteName: "FIREシミュレーター",
    },
  };
}

/* ---------- helpers ---------- */

function yen(v: number): string {
  return v.toLocaleString() + "円";
}

function man(v: number): string {
  return Math.round(v / 10_000).toLocaleString() + "万円";
}

/* ---------- page ---------- */

export default async function IncomeDetailPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const level = Number(amount);
  if (!INCOME_LEVELS.includes(level as (typeof INCOME_LEVELS)[number])) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p>指定された年収のページは存在しません。</p>
        <Link href="/income/" className="text-primary-600 hover:underline">
          手取り早見表に戻る
        </Link>
      </div>
    );
  }

  const gross = level * 10_000;
  const results: Record<FamilyPattern, ReturnType<typeof calcTakeHome>> = {
    single: calcTakeHome(gross, "single"),
    couple: calcTakeHome(gross, "couple"),
    "couple-child1": calcTakeHome(gross, "couple-child1"),
  };
  const r = results.single;

  // 前後の年収
  const idx = INCOME_LEVELS.indexOf(level as (typeof INCOME_LEVELS)[number]);
  const prev = idx > 0 ? INCOME_LEVELS[idx - 1] : null;
  const next = idx < INCOME_LEVELS.length - 1 ? INCOME_LEVELS[idx + 1] : null;

  // FIRE目安: 貯蓄率20%で毎月の積立額
  const monthlySavings = Math.round(r.takeHomeMonthly * 0.2);
  const savingsRateLabel = "20%";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `年収${level.toLocaleString()}万円の手取り額`,
    description: `年収${level.toLocaleString()}万円の手取りは約${man(r.takeHomeAnnual)}。税金・保険料の内訳と家族構成別比較。`,
    url: `${SITE_URL}/income/${level}/`,
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

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `年収${level.toLocaleString()}万円の手取りはいくら？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `年収${level.toLocaleString()}万円（独身・扶養なし）の手取りは約${man(r.takeHomeAnnual)}（月額約${man(r.takeHomeMonthly)}）です。手取り率は${r.takeHomeRate}%で、所得税${man(r.incomeTax)}・住民税${man(r.residentTax)}・社会保険料${man(r.socialInsurance.total)}が天引きされます。`,
        },
      },
      {
        "@type": "Question",
        name: `年収${level.toLocaleString()}万円の月収手取りは？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `年収${level.toLocaleString()}万円をボーナスなしの12ヶ月で割ると、月額の手取りは約${man(r.takeHomeMonthly)}です。ボーナスがある場合は月々の手取りはこれより少なくなります。`,
        },
      },
      {
        "@type": "Question",
        name: `年収${level.toLocaleString()}万円でFIREするには？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `年収${level.toLocaleString()}万円の手取りから貯蓄率${savingsRateLabel}（月${monthlySavings.toLocaleString()}円）で積立投資を行った場合のFIRE達成年をシミュレーションで計算できます。`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />

      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "手取り早見表", href: "/income/" },
          { label: `年収${level.toLocaleString()}万円` },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        年収{level.toLocaleString()}万円の手取り額
      </h1>

      {/* ---------- ヘッドライン ---------- */}
      <div className="mt-6 rounded-lg border-2 border-primary-200 bg-primary-50 p-5">
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">年収（額面）</p>
            <p className="mt-1 text-lg font-bold text-gray-800">
              {level.toLocaleString()}万円
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">手取り（年額）</p>
            <p className="mt-1 text-lg font-bold text-primary-700">
              {man(r.takeHomeAnnual)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">手取り（月額）</p>
            <p className="mt-1 text-lg font-bold text-primary-700">
              {man(r.takeHomeMonthly)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">手取り率</p>
            <p className="mt-1 text-lg font-bold text-primary-700">
              {r.takeHomeRate}%
            </p>
          </div>
        </div>
      </div>

      {/* ---------- 詳細内訳（独身） ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          税金・社会保険料の内訳
        </h2>
        <p className="mt-1 text-xs text-gray-500">独身・扶養なしの場合</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`年収${level.toLocaleString()}万円の税金・社会保険料の内訳`}>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">年収（額面）</td>
                <td className="px-4 py-3 text-right font-bold text-gray-800">
                  {yen(r.grossAnnual)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">
                  <span className="ml-3">健康保険料</span>
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  −{yen(r.socialInsurance.health)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">
                  <span className="ml-3">厚生年金保険料</span>
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  −{yen(r.socialInsurance.pension)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">
                  <span className="ml-3">雇用保険料</span>
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  −{yen(r.socialInsurance.employment)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">
                  社会保険料 小計
                </td>
                <td className="px-4 py-3 text-right font-medium text-red-600">
                  −{yen(r.socialInsurance.total)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">
                  <span className="ml-3">所得税（復興税込み）</span>
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  −{yen(r.incomeTax)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">
                  <span className="ml-3">住民税</span>
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  −{yen(r.residentTax)}
                </td>
              </tr>
              <tr className="border-t-2 border-gray-300 bg-primary-50">
                <td className="px-4 py-3 font-bold text-primary-800">
                  手取り額（年額）
                </td>
                <td className="px-4 py-3 text-right text-lg font-bold text-primary-800">
                  {yen(r.takeHomeAnnual)}
                </td>
              </tr>
              <tr className="bg-primary-50">
                <td className="px-4 py-3 font-medium text-primary-700">
                  手取り額（月額）
                </td>
                <td className="px-4 py-3 text-right font-bold text-primary-700">
                  {yen(r.takeHomeMonthly)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- 家族構成別比較 ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          家族構成別の手取り比較
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          配偶者控除・扶養控除の適用で同じ年収でも手取りが変わります。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" aria-label={`年収${level.toLocaleString()}万円の家族構成別手取り比較`}>
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-3 py-3 text-left font-medium text-gray-600">項目</th>
                {FAMILY_PATTERNS.map((f) => (
                  <th key={f} className="px-3 py-3 text-right font-medium text-gray-600">
                    {getFamilyLabel(f)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-2.5 text-gray-600">所得税</td>
                {FAMILY_PATTERNS.map((f) => (
                  <td key={f} className="px-3 py-2.5 text-right text-gray-700">
                    {man(results[f].incomeTax)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-gray-600">住民税</td>
                {FAMILY_PATTERNS.map((f) => (
                  <td key={f} className="px-3 py-2.5 text-right text-gray-700">
                    {man(results[f].residentTax)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-gray-600">社会保険料</td>
                {FAMILY_PATTERNS.map((f) => (
                  <td key={f} className="px-3 py-2.5 text-right text-gray-700">
                    {man(results[f].socialInsurance.total)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary-50">
                <td className="px-3 py-2.5 font-bold text-primary-800">手取り（年額）</td>
                {FAMILY_PATTERNS.map((f) => (
                  <td key={f} className="px-3 py-2.5 text-right font-bold text-primary-800">
                    {man(results[f].takeHomeAnnual)}
                  </td>
                ))}
              </tr>
              <tr className="bg-primary-50">
                <td className="px-3 py-2.5 font-medium text-primary-700">手取り（月額）</td>
                {FAMILY_PATTERNS.map((f) => (
                  <td key={f} className="px-3 py-2.5 text-right font-medium text-primary-700">
                    {man(results[f].takeHomeMonthly)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-gray-600">手取り率</td>
                {FAMILY_PATTERNS.map((f) => (
                  <td key={f} className="px-3 py-2.5 text-right text-gray-500">
                    {results[f].takeHomeRate}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          ※社会保険料は家族構成に関わらず同額。配偶者は年収103万円以下、子は16歳以上を想定。
        </p>
      </section>

      {/* ---------- FIRE接続 ---------- */}
      <section className="mt-10">
        <div className="rounded-lg border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-accent-50 p-6">
          <h2 className="text-lg font-bold text-primary-800">
            年収{level.toLocaleString()}万円でFIREするには？
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            手取り月額<strong className="text-primary-700">{man(r.takeHomeMonthly)}</strong>のうち
            {savingsRateLabel}を貯蓄に回すと、毎月の積立額は
            <strong className="text-primary-700">約{(monthlySavings / 10_000).toFixed(1)}万円</strong>。
            この条件でFIRE達成までの年数をシミュレーションできます。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/simulate/?income=${level}&assets=0&invest=${Math.round(monthlySavings / 10_000 * 10) / 10}`}
              className="btn-primary"
            >
              シミュレーションで計算する
            </Link>
            <Link
              href="/diagnose/"
              className="btn-secondary"
            >
              FIRE診断を受ける
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 節税ポイント ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          手取りを増やす節税テクニック
        </h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-bold text-gray-800">新NISA</p>
            <p className="mt-1 text-sm text-gray-600">
              年間360万円まで非課税で投資可能。運用益に約20%の税金がかからないため、
              長期投資の手取りを大幅に改善。
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-bold text-gray-800">iDeCo（個人型確定拠出年金）</p>
            <p className="mt-1 text-sm text-gray-600">
              掛金が全額所得控除に。会社員は月23,000円（年27.6万円）まで。
              年収{level.toLocaleString()}万円なら年間約{level >= 700 ? "8〜9" : level >= 400 ? "5〜6" : "4〜5"}万円の節税効果。
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-bold text-gray-800">ふるさと納税</p>
            <p className="mt-1 text-sm text-gray-600">
              自己負担2,000円で返礼品を受け取れる。年収{level.toLocaleString()}万円（独身）の上限目安は
              約{level >= 1000 ? "17" : level >= 700 ? "11〜13" : level >= 500 ? "6〜8" : level >= 300 ? "3〜4" : "1〜2"}万円。
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">よくある質問</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="font-bold text-gray-800">
              Q. 年収{level.toLocaleString()}万円の手取りはいくら？
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              独身・扶養なしの場合、年収{level.toLocaleString()}万円の手取りは
              約{man(r.takeHomeAnnual)}（月額約{man(r.takeHomeMonthly)}）です。
              手取り率は{r.takeHomeRate}%で、
              社会保険料{man(r.socialInsurance.total)}・所得税{man(r.incomeTax)}・住民税{man(r.residentTax)}が差し引かれます。
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              Q. 年収{level.toLocaleString()}万円の月収手取りは？
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              ボーナスなしで12ヶ月均等の場合、月額の手取りは約{man(r.takeHomeMonthly)}です。
              ボーナスが年2回ある場合は、月々の手取りはこれより少なくなります（ボーナスからも税金・社会保険料が引かれます）。
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              Q. 配偶者がいると手取りは増える？
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              配偶者の年収が103万円以下の場合、配偶者控除（所得税38万円・住民税33万円）が適用され、
              手取りが年間約{man(results["couple"].takeHomeAnnual - r.takeHomeAnnual)}増えます。
              {level >= 1000
                ? "ただし年収1,000万円超の場合、配偶者控除の適用が制限されます。"
                : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- 関連コンテンツ ---------- */}
      <RelatedContent
        items={[
          {
            href: "/recommend/",
            title: "おすすめ証券口座・投信",
            description: "FIRE達成に向けた口座開設ならこちら",
          },
          {
            href: "/guide/fire-tax-optimization/",
            title: "FIRE志向者の節税戦略",
            description: "手取りを最大化して資産形成を加速する方法",
          },
          {
            href: "/guide/nisa-ideco-for-fire/",
            title: "新NISA・iDeCoでFIRE加速",
            description: "非課税枠をフル活用する戦略を解説",
          },
          {
            href: "/plan/",
            title: "年収×年代別FIREプラン",
            description: "あなたの年収と年齢に最適なFIRE戦略",
          },
        ]}
      />

      {/* ---------- 前後の年収リンク ---------- */}
      <div className="mt-10 flex gap-3">
        {prev !== null && (
          <Link
            href={`/income/${prev}/`}
            className="flex-1 rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="text-xs text-gray-500">前の年収</p>
            <p className="mt-1 font-bold text-primary-700">
              {prev.toLocaleString()}万円
            </p>
          </Link>
        )}
        {next !== null && (
          <Link
            href={`/income/${next}/`}
            className="flex-1 rounded-lg border border-gray-200 bg-white p-4 text-center transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="text-xs text-gray-500">次の年収</p>
            <p className="mt-1 font-bold text-primary-700">
              {next.toLocaleString()}万円
            </p>
          </Link>
        )}
      </div>

      {/* ---------- 一覧リンク ---------- */}
      <div className="mt-6 text-center">
        <Link
          href="/income/"
          className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-800"
        >
          ← 手取り早見表に戻る
        </Link>
      </div>

      {/* ---------- 注意事項 ---------- */}
      <div className="mt-10 rounded-lg bg-gray-100 p-4 text-xs text-gray-500">
        <p className="font-medium">計算の前提</p>
        <p className="mt-1">
          2026年の税制に基づく概算。40歳未満・給与収入のみ・協会けんぽ全国平均で計算。
          ふるさと納税・iDeCo・住宅ローン控除等は含みません。
        </p>
      </div>
    </div>
  );
}
