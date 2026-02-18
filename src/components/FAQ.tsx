interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  prefName?: string;
}

export default function FAQ({ items, prefName }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">よくある質問</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-lg border border-gray-200 bg-white"
          >
            <summary className="cursor-pointer px-4 py-3 font-medium text-gray-800 marker:text-primary-500">
              {item.question}
            </summary>
            <p className="px-4 pb-3 text-sm text-gray-600">{item.answer}</p>
          </details>
        ))}
      </div>

      {/* 構造化データ (FAQ Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}

export function getDefaultFAQ(prefName: string): FAQItem[] {
  return [
    {
      question: `${prefName}でFIREするにはいくら必要？`,
      answer: `${prefName}の生活費係数を基に計算すると、独身の場合で約5,000〜8,000万円、夫婦+子供の場合は1億円以上が目安です。具体的な金額は年収・家族構成・住宅形態によって異なるため、シミュレーターで計算してみてください。`,
    },
    {
      question: "FIREの4%ルールとは？",
      answer:
        "4%ルール（SWR: Safe Withdrawal Rate）は、退職後に毎年資産の4%を取り崩しても、30年以上資産が枯渇しない確率が高いとされるルールです。1998年のトリニティ・スタディに基づいています。",
    },
    {
      question: "FIRE達成後の生活費はどのくらいを見込むべき？",
      answer: `${prefName}の場合、独身で月15〜25万円、夫婦で月20〜35万円が目安です。住宅費・医療費・趣味にかかる費用は個人差が大きいため、余裕を持った計画をおすすめします。`,
    },
    {
      question: "FIREにはどのくらいの期間がかかる？",
      answer:
        "年収や貯蓄率によって大きく異なります。手取りの50%以上を投資に回せる場合、15〜20年程度で達成できるケースもあります。まずはシミュレーションで確認してみましょう。",
    },
    {
      question: "FIREに最適な投資方法は？",
      answer:
        "一般的には、低コストの全世界株式インデックスファンドやS&P500連動ファンドへの長期積立投資が推奨されています。新NISAやiDeCoの税制優遇も活用しましょう。",
    },
    {
      question: `${prefName}は他の地域と比べてFIREしやすい？`,
      answer: `生活費係数が低い地域ほどFIRE必要資産は少なくなります。${prefName}の具体的な係数はシミュレーター上で確認でき、他の地域との比較も可能です。`,
    },
    {
      question: "子供がいてもFIREできる？",
      answer:
        "可能ですが、教育費を含む生活費が増えるため、必要資産は独身の1.5〜2倍程度になります。教育費のピーク時期を考慮した計画が重要です。",
    },
    {
      question: "シミュレーション結果はどのくらい正確？",
      answer:
        "本シミュレーションは簡易的な係数を用いた概算です。実際の税制・社会保険・インフレ率は変動するため、目安としてご活用ください。より精密な計算はFP（ファイナンシャルプランナー）への相談をおすすめします。",
    },
    {
      question: "新NISAはFIREにどう活用できる？",
      answer:
        "新NISAは年間360万円（つみたて投資枠120万円＋成長投資枠240万円）まで非課税で投資できます。生涯非課税保有限度額は1,800万円。運用益が非課税になるため、FIRE達成後の取り崩し時にも税金がかからず、FIRE必要資産を実質的に減らせます。",
    },
    {
      question: `${prefName}から他の地域に移住するとFIRE計画はどう変わる？`,
      answer: `生活費の低い地域に移住すると、FIRE必要資産が大幅に下がります。例えば東京（係数1.25）から地方（係数0.85前後）に移住すると、必要資産が約30%減少します。リモートワークが可能なら、移住FIRE戦略は非常に有効です。`,
    },
  ];
}
