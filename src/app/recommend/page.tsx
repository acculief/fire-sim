import { Metadata } from "next";
import Link from "next/link";
import { brokers, funds } from "@/data/recommend";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "FIRE達成におすすめの証券口座・投資信託【2026年最新】",
  description:
    "FIRE（経済的自立・早期退職）を目指す方におすすめのネット証券口座を徹底比較。新NISA・iDeCo対応状況、手数料、ポイント還元まで解説。",
  openGraph: {
    title: "FIRE達成におすすめの証券口座・投資信託【2026年最新】",
    description:
      "FIRE達成に最適なネット証券口座を比較。新NISA・iDeCo対応、手数料、ポイント還元を解説。",
    type: "website",
    url: "/recommend/",
    siteName: "FIREシミュレーター",
  },
};

/** 証券口座のおすすめ度データ */
const brokerRatings: Record<string, { stars: number; badges: string[] }> = {
  sbi: {
    stars: 5,
    badges: ["手数料無料", "NISA対応", "投信4,000本以上"],
  },
  rakuten: {
    stars: 5,
    badges: ["手数料無料", "NISA対応", "楽天ポイント連携"],
  },
  monex: {
    stars: 4,
    badges: ["手数料無料", "NISA対応", "米国株に強い"],
  },
  tossy: {
    stars: 5,
    badges: ["手数料無料", "NISA対応", "アプリで完結", "特典充実", "PR"],
  },
  "mufg-esmart": {
    stars: 4,
    badges: ["手数料無料", "NISA対応", "Pontaポイント"],
  },
  dmm: {
    stars: 5,
    badges: ["手数料無料", "NISA対応", "米国株手数料0円", "最短即日開設", "PR"],
  },
};

/** FAQ データ */
interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "投資初心者ですが大丈夫ですか？",
    answer:
      "まったく問題ありません。上記で紹介しているネット証券はいずれも初心者向けのガイドやサポートが充実しています。まずは新NISAのつみたて投資枠で、eMAXIS Slim 全世界株式（オルカン）を月1万円から積立設定するだけでスタートできます。難しい知識は不要で、一度設定すれば自動的に積み立てられます。",
  },
  {
    question: "いくらから始められますか？",
    answer:
      "SBI証券や楽天証券では、投資信託を100円から購入できます。まずは少額で始めて値動きに慣れ、徐々に金額を増やしていくのがおすすめです。新NISAのつみたて投資枠は年間120万円（月10万円）まで非課税で投資でき、無理のない範囲でコツコツ積み立てることがFIRE達成への近道です。",
  },
  {
    question: "NISAとiDeCoどちらを優先すべき？",
    answer:
      "一般的には新NISAを優先するのがおすすめです。NISAはいつでも引き出せる柔軟性があり、年間360万円（つみたて枠120万円＋成長投資枠240万円）まで非課税で投資できます。一方、iDeCoは掛金が全額所得控除になる節税メリットがありますが、原則60歳まで引き出せません。FIRE後の生活資金として使うにはNISAの方が使い勝手が良いです。余裕があれば両方活用するのが理想的です。",
  },
  {
    question: "証券口座は複数開設しても良いですか？",
    answer:
      "はい、証券口座は複数の証券会社で開設できます。ただし、NISA口座は1人1口座（1つの金融機関）のみです。メインの証券口座でNISAを利用し、サブの証券口座で特定口座を使うといった使い分けが可能です。まずはSBI証券か楽天証券でNISA口座を開設するのがおすすめです。",
  },
];

/** 星表示ヘルパー */
function StarRating({ count }: { count: number }) {
  return (
    <span className="text-amber-400" aria-label={`おすすめ度：${count}点（5点満点）`}>
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

/** ステップ番号コンポーネント */
function StepNumber({ num }: { num: number }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
      {num}
    </span>
  );
}

export default function RecommendPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "FIRE達成におすすめの証券口座・投資信託",
    description:
      "FIRE（経済的自立・早期退職）を目指す方におすすめのネット証券口座を徹底比較。新NISA・iDeCo対応状況も解説。",
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
          { label: "おすすめ" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        FIRE達成におすすめの証券口座・投資信託
      </h1>
      <p className="mt-2 text-gray-600">
        FIRE（経済的自立・早期退職）を目指す方に役立つネット証券口座・投資信託を厳選比較しました。
      </p>

      {/* 目次 */}
      <nav className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-sm font-bold text-gray-700">目次</p>
        <ol className="list-inside list-decimal space-y-1 text-sm text-primary-700">
          <li>
            <a href="#brokers" className="hover:underline">
              証券口座比較テーブル
            </a>
          </li>
          <li>
            <a href="#how-to-open" className="hover:underline">
              口座開設の手順
            </a>
          </li>
          <li>
            <a href="#funds" className="hover:underline">
              おすすめ投資信託
            </a>
          </li>
          <li>
            <a href="#faq" className="hover:underline">
              よくある質問
            </a>
          </li>
        </ol>
      </nav>

      {/* ===== 証券口座比較テーブル ===== */}
      <section id="brokers" className="mt-10">
        <h2 className="text-xl font-bold text-gray-800">
          証券口座比較テーブル
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          FIRE達成には証券口座の開設が第一歩。新NISA・iDeCoに対応し、低コストで投信積立ができるネット証券を比較します。
        </p>

        {/* レスポンシブ比較表 */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-600">
                  証券会社
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">
                  クレカ積立
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">
                  投信本数
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">
                  米国株
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">
                  ポイント
                </th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">
                  おすすめ度
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brokers.map((b) => {
                const rating = brokerRatings[b.slug];
                return (
                  <tr key={b.slug} className={b.isAffiliate ? "bg-primary-50/50" : ""}>
                    <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        {b.name}
                        {b.isAffiliate && (
                          <span className="rounded bg-accent-500 px-1 py-0.5 text-[10px] font-bold text-white leading-none">おすすめ</span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center font-medium text-primary-700 whitespace-nowrap">
                      {b.creditCardReturn}
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {b.fundCount}
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {b.usStockCount}
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {b.pointType}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {rating && <StarRating count={rating.stars} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          ※新NISA対応。iDeCo・投信取扱は証券会社により異なります
        </p>

        {/* 証券会社詳細カード */}
        <div className="mt-6 space-y-4">
          {brokers.map((b) => {
            const rating = brokerRatings[b.slug];
            return (
              <div
                key={b.slug}
                className="rounded-lg border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-800">{b.name}</h3>
                  {rating && (
                    <span className="text-sm">
                      <StarRating count={rating.stars} />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">{b.description}</p>

                {/* バッジ */}
                {rating && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rating.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <ul className="mt-3 space-y-1">
                  {b.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start text-sm text-gray-700"
                    >
                      <span className="mr-2 mt-0.5 text-primary-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={b.affiliateUrl ?? b.url}
                  target="_blank"
                  rel={b.isAffiliate ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  className="btn-primary mt-4 inline-block text-sm"
                >
                  {b.name}を詳しく見る {b.isAffiliate && <span className="text-xs opacity-75">PR</span>}
                </a>
                {b.trackingPixel && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={b.trackingPixel} width={1} height={1} alt="" className="inline" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 口座開設の手順 ===== */}
      <section id="how-to-open" className="mt-12">
        <h2 className="text-xl font-bold text-gray-800">
          口座開設の手順（5ステップ）
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          証券口座の開設から積立設定まで、最短で始められる手順を解説します。
        </p>

        <div className="mt-6 space-y-5">
          {/* Step 1 */}
          <div className="flex gap-4">
            <StepNumber num={1} />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">
                証券口座を選ぶ
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                上記の比較表を参考に、自分に合った証券会社を選びましょう。迷ったらSBI証券か楽天証券がおすすめです。
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <StepNumber num={2} />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">
                オンラインで口座開設を申し込む
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                各証券会社の公式サイトからオンラインで申し込めます。マイナンバーカードがあると最短翌日に開設できます。
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <StepNumber num={3} />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">
                NISA口座を同時に申し込む
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                口座開設時にNISA口座も同時に申し込みましょう。つみたて投資枠（年120万円）と成長投資枠（年240万円）の両方が使えます。
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <StepNumber num={4} />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">
                銀行口座との自動連携を設定する
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                SBI証券なら住信SBIネット銀行、楽天証券なら楽天銀行との連携で、入出金が自動化されて便利です。金利優遇も受けられます。
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <StepNumber num={5} />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">
                全世界株式またはS&P500の投信で積立設定
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                eMAXIS Slim 全世界株式（オルカン）またはeMAXIS Slim
                米国株式（S&P500）で毎月の積立設定をしましょう。クレカ積立を設定するとポイント還元も受けられます。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 p-4">
          <p className="text-sm font-medium text-primary-800">
            ここまでの設定で、あとは毎月自動で積み立てられます。「ほったらかし」でFIREに向けた資産形成がスタートできます。
          </p>
        </div>
      </section>

      {/* ===== 投資信託 ===== */}
      <section id="funds" className="mt-12">
        <h2 className="text-xl font-bold text-gray-800">
          FIRE向けおすすめ投資信託
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          長期積立に適した低コストインデックスファンドを厳選。新NISAのつみたて投資枠で購入可能です。
        </p>
        <div className="mt-4 space-y-3">
          {funds.map((f) => (
            <div
              key={f.name}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{f.name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {f.type} / 信託報酬：{f.costRatio}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                  {f.type}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="mt-12">
        <h2 className="text-xl font-bold text-gray-800">
          よくある質問
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          投資を始める前に気になるポイントをまとめました。
        </p>
        <div className="mt-4 space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-gray-200 bg-white"
              open={i === 0}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-bold text-gray-800 hover:text-primary-600">
                <span>{faq.question}</span>
                <svg
                  className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </summary>
              <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          まずはFIRE達成までの道のりを確認しましょう
        </p>
        <p className="mt-1 text-sm text-primary-700">
          地域・年収・家族構成から、必要資産と達成年をシミュレーション
        </p>
        <Link
          href="/simulate/"
          className="btn-primary mt-4 inline-block text-lg"
        >
          無料でシミュレーション開始
        </Link>
      </div>

      {/* 関連ガイド */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-800">関連ガイド記事</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href="/guide/4percent-rule/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">4%ルール（SWR）徹底解説</p>
          </Link>
          <Link
            href="/guide/fire-index-investing/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">
              FIREのためのインデックス投資入門
            </p>
          </Link>
          <Link
            href="/guide/fire-tax-optimization/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">FIRE志向者の節税戦略</p>
          </Link>
          <Link
            href="/guide/fire-savings-rate/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">
              貯蓄率とFIRE達成年の関係
            </p>
          </Link>
        </div>
      </div>

      {/* 関連ツール */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-gray-800">関連ツール</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href="/diagnose/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">FIRE達成度診断</p>
            <p className="mt-1 text-xs text-gray-500">30秒であなたのFIRE達成度をチェック</p>
          </Link>
          <Link
            href="/tracker/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">FIRE進捗トラッカー</p>
            <p className="mt-1 text-xs text-gray-500">毎月の資産を記録して達成度を可視化</p>
          </Link>
          <Link
            href="/cases/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">モデルケース</p>
            <p className="mt-1 text-xs text-gray-500">年代別のFIRE達成プランを参考に</p>
          </Link>
          <Link
            href="/withdraw/"
            className="block rounded-lg border border-gray-200 bg-white p-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">取り崩しシミュレーション</p>
            <p className="mt-1 text-xs text-gray-500">FIRE後に資産が何歳まで持つか計算</p>
          </Link>
        </div>
      </div>

      <Disclaimer />

      {/* アフィリエイト開示 */}
      <p className="mt-4 text-center text-xs text-gray-400">
        ※当サイトはアフィリエイトプログラムに参加しています
      </p>
    </div>
  );
}
