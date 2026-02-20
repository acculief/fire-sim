import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RelatedContent from "@/components/RelatedContent";

export const metadata: Metadata = {
  title: "よくある質問（FAQ） | FIREの基礎知識",
  description:
    "FIRE（経済的自立・早期退職）に関するよくある質問。4%ルール、必要資産額、新NISA活用法、住む場所の影響など10問に回答。",
  alternates: { canonical: "/faq/" },
  openGraph: {
    title: "よくある質問（FAQ） | FIREの基礎知識",
    description:
      "FIRE（経済的自立・早期退職）に関するよくある質問。4%ルール、必要資産額、新NISA活用法、住む場所の影響など10問に回答。",
    url: "/faq/",
  },
};

interface FaqItem {
  question: string;
  /** JSON-LD 用のプレーンテキスト回答 */
  answer: string;
  /** 内部リンクを含む表示用 JSX（省略時は answer をそのまま表示） */
  answerContent?: ReactNode;
}

const linkClass = "text-primary-600 underline hover:text-primary-800";

const faqs: FaqItem[] = [
  {
    question: "FIREとは何ですか？",
    answer:
      "FIRE（Financial Independence, Retire Early）とは、十分な資産を築いて経済的に自立し、早期退職を目指すライフスタイルです。年間支出の25倍の資産を築き、投資の運用益で生活費をまかなうことで、仕事に縛られない自由な生き方を実現します。",
    answerContent: (
      <>
        FIRE（Financial Independence, Retire Early）とは、十分な資産を築いて経済的に自立し、早期退職を目指すライフスタイルです。年間支出の25倍の資産を築き、投資の運用益で生活費をまかなうことで、仕事に縛られない自由な生き方を実現します。詳しくは<Link href="/guide/what-is-fire/" className={linkClass}>FIREとは？基礎から解説</Link>をご覧ください。
      </>
    ),
  },
  {
    question: "FIREに必要な資産はいくらですか？",
    answer:
      "一般的には「年間生活費 × 25倍」が目安です。例えば月25万円（年間300万円）の生活費なら、300万円 × 25 = 7,500万円が目標資産額になります。ただし居住地域や家族構成によって大きく異なります。当サイトのシミュレーションで、あなたの条件に合った正確な金額を計算できます。",
    answerContent: (
      <>
        一般的には「年間生活費 × 25倍」が目安です。例えば月25万円（年間300万円）の生活費なら、300万円 × 25 = 7,500万円が目標資産額になります。ただし居住地域や家族構成によって大きく異なります。<Link href="/simulate/" className={linkClass}>シミュレーション</Link>で、あなたの条件に合った正確な金額を計算できます。
      </>
    ),
  },
  {
    question: "4%ルールとは何ですか？",
    answer:
      "4%ルール（セーフ・ウィズドローアル・レート）とは、資産の4%を毎年取り崩しても30年間は資産が枯渇しない確率が95%以上とされるルールです。1998年のトリニティ研究に基づいています。これが「年間支出の25倍」という目標資産の根拠になっています。",
    answerContent: (
      <>
        4%ルール（セーフ・ウィズドローアル・レート）とは、資産の4%を毎年取り崩しても30年間は資産が枯渇しない確率が95%以上とされるルールです。1998年のトリニティ研究に基づいています。これが「年間支出の25倍」という目標資産の根拠になっています。詳しくは<Link href="/guide/4percent-rule/" className={linkClass}>4%ルール徹底解説</Link>をご覧ください。
      </>
    ),
  },
  {
    question: "FIREを目指すにはどんな投資がおすすめですか？",
    answer:
      "FIRE達成者の多くはインデックス投資を活用しています。全世界株式やS&P500に連動する低コストの投資信託を、新NISA・iDeCoなどの税制優遇制度を利用して長期積立するのが王道戦略です。個別株よりもリスク分散が効き、手間もかかりません。",
    answerContent: (
      <>
        FIRE達成者の多くは<Link href="/guide/fire-index-investing/" className={linkClass}>インデックス投資</Link>を活用しています。全世界株式やS&amp;P500に連動する低コストの投資信託を、新NISA・iDeCoなどの税制優遇制度を利用して長期積立するのが王道戦略です。<Link href="/recommend/" className={linkClass}>おすすめの証券口座・投資信託</Link>も参考にしてください。
      </>
    ),
  },
  {
    question: "新NISAはFIRE達成にどう役立ちますか？",
    answer:
      "新NISAでは、つみたて投資枠（年120万円）と成長投資枠（年240万円）の合計年間360万円、生涯非課税枠1,800万円まで投資益が非課税になります。通常約20%かかる税金がゼロになるため、FIRE達成を大幅に加速できます。",
    answerContent: (
      <>
        新NISAでは、つみたて投資枠（年120万円）と成長投資枠（年240万円）の合計年間360万円、生涯非課税枠1,800万円まで投資益が非課税になります。通常約20%かかる税金がゼロになるため、FIRE達成を大幅に加速できます。活用法は<Link href="/guide/nisa-ideco-for-fire/" className={linkClass}>NISA・iDeCo活用ガイド</Link>で解説しています。
      </>
    ),
  },
  {
    question: "サイドFIREとフルFIREの違いは何ですか？",
    answer:
      "フルFIREは資産運用だけで生活費の全額をまかなう完全なリタイアです。サイドFIREは資産運用で基本生活費をカバーしつつ、好きな仕事やフリーランスで少額の収入を得るスタイルです。サイドFIREなら必要資産が少なく、より早い達成が可能です。",
    answerContent: (
      <>
        フルFIREは資産運用だけで生活費の全額をまかなう完全なリタイアです。サイドFIREは資産運用で基本生活費をカバーしつつ、好きな仕事やフリーランスで少額の収入を得るスタイルです。サイドFIREなら必要資産が少なく、より早い達成が可能です。詳しくは<Link href="/guide/side-fire/" className={linkClass}>サイドFIREとは</Link>をご覧ください。
      </>
    ),
  },
  {
    question: "FIREに住む場所は関係ありますか？",
    answer:
      "大きく関係します。東京の生活費を基準にすると、地方では月5〜10万円安くなることもあり、FIRE必要資産が1,500〜3,000万円減ることもあります。当サイトでは47都道府県の物価係数を反映したシミュレーションが可能です。",
    answerContent: (
      <>
        大きく関係します。東京の生活費を基準にすると、地方では月5〜10万円安くなることもあり、FIRE必要資産が1,500〜3,000万円減ることもあります。<Link href="/fire/" className={linkClass}>47都道府県の地域別シミュレーション</Link>で比較できます。
      </>
    ),
  },
  {
    question: "何歳からFIREを目指すのが現実的ですか？",
    answer:
      "理論上は何歳からでも始められますが、20〜30代から始めると複利効果を最大限に活かせるため有利です。40代・50代からでも、貯蓄率を高めればセミリタイアやサイドFIREは十分に現実的です。重要なのは「今すぐ始めること」です。",
    answerContent: (
      <>
        理論上は何歳からでも始められますが、20〜30代から始めると複利効果を最大限に活かせるため有利です。40代・50代からでも、貯蓄率を高めればセミリタイアやサイドFIREは十分に現実的です。<Link href="/plan/" className={linkClass}>年収×年代別プラン</Link>であなたに近い条件を確認してみてください。
      </>
    ),
  },
  {
    question: "FIRE達成後の健康保険や年金はどうなりますか？",
    answer:
      "退職後は国民健康保険（または任意継続）と国民年金に加入します。国民健康保険料は前年の所得に基づくため、退職直後は高額になる場合があります。当サイトのシミュレーションでは、退職後の社会保険コストも月2万円として計算に含めています。",
  },
  {
    question: "このシミュレーションの計算は正確ですか？",
    answer:
      "当サイトのシミュレーションは、総務省の家計調査データに基づく地域別物価係数、税・社会保険の概算を使った概算値です。楽観・中立・悲観の3シナリオで比較でき、感度分析も確認できます。ただし実際の投資リターンは変動するため、あくまで目安としてご利用ください。",
    answerContent: (
      <>
        当サイトの<Link href="/simulate/" className={linkClass}>シミュレーション</Link>は、総務省の家計調査データに基づく地域別物価係数、税・社会保険の概算を使った概算値です。楽観・中立・悲観の3シナリオで比較でき、感度分析も確認できます。ただし実際の投資リターンは変動するため、あくまで目安としてご利用ください。
      </>
    ),
  },
];

// FAQPage構造化データ
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={faqJsonLd} />

      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "よくある質問" }]} />

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        よくある質問（FAQ）
      </h1>
      <p className="mt-2 text-gray-600">
        FIRE（経済的自立・早期退職）に関するよくある質問にお答えします。
      </p>

      <div className="mt-8 space-y-6">
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
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600">
              {faq.answerContent ?? faq.answer}
            </div>
          </details>
        ))}
      </div>

      <RelatedContent
        items={[
          { href: "/guide/what-is-fire/", title: "FIREとは？基礎から解説", description: "FIREの基本概念と目指し方" },
          { href: "/guide/4percent-rule/", title: "4%ルール徹底解説", description: "取り崩し率の根拠と注意点" },
          { href: "/cases/", title: "年代別モデルケース", description: "あなたに近い条件のFIREプランを参考に" },
          { href: "/guide/fire-index-investing/", title: "インデックス投資入門", description: "FIRE達成の王道戦略" },
        ]}
      />

      {/* CTA */}
      <div className="mt-10 rounded-xl border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          あなたのFIRE必要資産を計算しよう
        </p>
        <p className="mt-1 text-sm text-primary-700">
          地域・年収・家族構成をもとに、必要資産と達成年齢をシミュレーション
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link href="/simulate/" className="btn-primary">
            シミュレーション
          </Link>
          <Link
            href="/diagnose/"
            className="btn-secondary"
          >
            約1分でFIRE診断
          </Link>
        </div>
      </div>
    </div>
  );
}
