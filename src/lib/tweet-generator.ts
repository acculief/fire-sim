import { prefectures } from "@/data/prefectures";
import { DEFAULTS, AGE_GROUPS_FOR_SEO } from "@/config/assumptions";
import { runSimulation } from "./calculator";
import type { SimulationInput } from "./types";
import { formatMoney } from "./format";

const SITE_URL = "https://fire-sim-phi.vercel.app";

type TweetGenerator = () => string;

/** ランダムに1つ選ぶ */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** シミュレーション実行のショートカット */
function sim(overrides: Partial<SimulationInput>) {
  const input: SimulationInput = {
    prefecture: DEFAULTS.prefecture,
    annualIncome: DEFAULTS.annualIncome,
    incomeType: DEFAULTS.incomeType,
    currentAssets: DEFAULTS.currentAssets,
    monthlyInvestment: DEFAULTS.monthlyInvestment,
    familyType: DEFAULTS.familyType,
    housingType: DEFAULTS.housingType,
    currentAge: DEFAULTS.currentAge,
    annualReturnRate: DEFAULTS.annualReturnRate,
    swr: DEFAULTS.swr,
    inflationRate: DEFAULTS.inflationRate,
    fireStrategy: DEFAULTS.fireStrategy,
    yieldRate: DEFAULTS.yieldRate,
    dividendTaxRate: DEFAULTS.dividendTaxRate,
    ...overrides,
  };
  return runSimulation(input);
}

/** 都道府県比較ツイート */
const prefComparison: TweetGenerator = () => {
  const sorted = [...prefectures].sort((a, b) => a.costIndex - b.costIndex);
  const cheap = sorted[0];
  const expensive = sorted[sorted.length - 1];

  const cheapResult = sim({ prefecture: cheap.code }).scenarios.neutral;
  const expResult = sim({ prefecture: expensive.code }).scenarios.neutral;
  const diff = expResult.fireNumber - cheapResult.fireNumber;

  return `【住む場所でFIRE必要額が変わる】

${cheap.name}（係数${cheap.costIndex}）→ ${formatMoney(cheapResult.fireNumber)}
${expensive.name}（係数${expensive.costIndex}）→ ${formatMoney(expResult.fireNumber)}

差額：${formatMoney(diff)}

住む場所を変えるだけでFIREが近づきます。

▶ 47都道府県で比較
${SITE_URL}/fire/

#FIRE #早期リタイア #資産形成`;
};

/** 年収別ツイート */
const incomeInsight: TweetGenerator = () => {
  const incomes = [300, 500, 700, 1000];
  const income = pick(incomes);
  const pref = pick(prefectures);
  const result = sim({ prefecture: pref.code, annualIncome: income }).scenarios.neutral;
  const ageText = result.achievementAge !== null ? `${result.achievementAge}歳` : "達成困難";

  return `【${pref.name}・年収${income}万円のFIRE】

必要資産：${formatMoney(result.fireNumber)}
月間生活費：${result.monthlyExpense}万円
達成年齢：${ageText}

※30歳開始・独身・賃貸・利回り4%の場合

▶ あなたの条件で計算
${SITE_URL}/fire/${pref.code}/income/${income}/

#FIRE #セミリタイア #${pref.name}`;
};

/** 年代別ツイート */
const ageInsight: TweetGenerator = () => {
  const age = pick(AGE_GROUPS_FOR_SEO);
  const pref = pick(prefectures.filter((p) => p.costIndex >= 0.95));
  const result = sim({
    prefecture: pref.code,
    currentAge: age.representativeAge,
    currentAssets: age.currentAssets,
    monthlyInvestment: age.monthlyInvestment,
  }).scenarios.neutral;
  const ageText = result.achievementAge !== null ? `${result.achievementAge}歳` : "要プラン見直し";

  return `【${age.label}から始めるFIRE】

${pref.name}在住・年収500万の場合
初期資産：${age.currentAssets}万円
月間積立：${age.monthlyInvestment}万円
→ 達成年齢：${ageText}

${age.slug === "20s" ? "複利の力で少額積立でも到達可能" : age.slug === "30s" ? "収入と投資のバランスが取りやすい時期" : age.slug === "40s" ? "蓄積資産の複利が効くフェーズ" : "退職金活用やサイドFIREも選択肢"}

▶ ${age.label}のFIRE計算
${SITE_URL}/fire/${pref.code}/age/${age.slug}/

#FIRE #${age.label} #資産運用`;
};

/** 住宅タイプ比較ツイート */
const housingInsight: TweetGenerator = () => {
  const pref = pick(prefectures.filter((p) => p.costIndex >= 1.0));
  const rent = sim({ prefecture: pref.code, housingType: "rent" }).scenarios.neutral;
  const own = sim({ prefecture: pref.code, housingType: "own" }).scenarios.neutral;
  const diff = rent.fireNumber - own.fireNumber;

  return `【賃貸 vs 持ち家完済でFIRE比較】

${pref.name}・年収500万・独身の場合

賃貸 → 必要資産 ${formatMoney(rent.fireNumber)}
持ち家（完済）→ ${formatMoney(own.fireNumber)}

差額：${formatMoney(diff)}

住居費ゼロの効果は大きい。

▶ 住宅タイプ別で計算
${SITE_URL}/fire/${pref.code}/housing/rent/

#FIRE #持ち家 #賃貸 #資産形成`;
};

/** 豆知識ツイート */
const fireTip: TweetGenerator = () => {
  const tips = [
    `FIREの4%ルールとは？

年間生活費の25倍の資産があれば、年4%の取り崩しで資産を維持できるという考え方。

例：月20万円の生活費
→ 年240万 × 25 = 6,000万円

▶ あなたの必要額を計算
${SITE_URL}/simulate/`,
    `FIRE達成を早める3つの方法

1. 生活費を下げる（住む場所・住宅タイプ）
2. 収入を上げる（副業・転職）
3. 投資利回りを上げる（インデックス投資）

1が最もコントロールしやすく効果大。

▶ 地域別の生活費比較
${SITE_URL}/fire/`,
    `「地方移住FIRE」が注目される理由

東京の生活費係数：1.25
地方平均：約0.87

同じ年収でも必要資産が数百万円変わります。
リモートワーク可能なら検討の価値あり。

▶ 47都道府県で比較
${SITE_URL}/fire/`,
  ];
  return pick(tips) + "\n\n#FIRE #早期リタイア #資産形成";
};

/** 全テンプレートからランダムに1つ生成 */
export function generateTweet(): string {
  const generators: TweetGenerator[] = [
    prefComparison,
    incomeInsight,
    incomeInsight,
    ageInsight,
    ageInsight,
    housingInsight,
    fireTip,
  ];
  return pick(generators)();
}
