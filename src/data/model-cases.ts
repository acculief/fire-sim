import { estimateMonthlyExpense, calcFireNumber, calcAchievementYears } from "@/lib/calculator";
import { getPrefectureByCode } from "@/data/prefectures";
import { estimatePostFireMonthlyCost } from "@/config/assumptions";

export interface ModelCase {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  age: number;
  annualIncome: number;
  prefecture: string;
  prefectureName: string;
  familyType: string;
  housingType: string;
  currentAssets: number;
  monthlyInvestment: number;
  fireNumber: number;
  monthlyExpense: number;
  achievementAge: number | null;
  yearsToFire: number | null;
  keyPoints: string[];
}

interface ModelCaseInput {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  age: number;
  annualIncome: number;
  prefecture: string;
  familyType: string;
  housingType: string;
  currentAssets: number;
  monthlyInvestment: number;
  keyPoints: string[];
}

const SWR = 0.04;
const ANNUAL_RETURN_RATE = 0.05;
const INFLATION_RATE = 0.01;

function buildModelCase(input: ModelCaseInput): ModelCase {
  const pref = getPrefectureByCode(input.prefecture);
  const costIndex = pref?.costIndex ?? 1.0;
  const prefectureName = pref?.name ?? input.prefecture;

  const baseMonthlyExpense = estimateMonthlyExpense(
    costIndex,
    input.familyType,
    input.housingType,
  );
  const postFireMonthlyCost = estimatePostFireMonthlyCost(input.familyType);
  const totalMonthlyExpense = baseMonthlyExpense + postFireMonthlyCost;
  const annualExpense = totalMonthlyExpense * 12;
  const fireNumber = calcFireNumber(annualExpense, SWR);
  const annualInvestment = input.monthlyInvestment * 12;

  const { years } = calcAchievementYears(
    input.currentAssets,
    annualInvestment,
    ANNUAL_RETURN_RATE,
    fireNumber,
    INFLATION_RATE,
  );

  return {
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    description: input.description,
    age: input.age,
    annualIncome: input.annualIncome,
    prefecture: input.prefecture,
    prefectureName,
    familyType: input.familyType,
    housingType: input.housingType,
    currentAssets: input.currentAssets,
    monthlyInvestment: input.monthlyInvestment,
    fireNumber: Math.round(fireNumber),
    monthlyExpense: Math.round(totalMonthlyExpense * 10) / 10,
    achievementAge: years !== null ? input.age + years : null,
    yearsToFire: years,
    keyPoints: input.keyPoints,
  };
}

const caseInputs: ModelCaseInput[] = [
  {
    slug: "30s-single-tokyo",
    title: "30代独身・東京在住",
    subtitle: "年収500万円でFIREを目指す",
    description:
      "32歳・年収500万円・東京都在住の独身者がFIREを目指すモデルケース。東京の高い生活費を踏まえた必要資産額と達成シミュレーション。",
    age: 32,
    annualIncome: 500,
    prefecture: "tokyo",
    familyType: "single",
    housingType: "rent",
    currentAssets: 300,
    monthlyInvestment: 10,
    keyPoints: [
      "東京の生活費係数は1.25と全国最高水準。家賃が必要資産を大きく押し上げる",
      "月10万円の積立では達成が60代半ばに。積立額を月13万円に増やすと5年以上短縮可能",
      "家賃を抑えるために郊外や近県への引っ越しも有効な戦略",
      "独身の強みは身軽さ。副業や転職で収入アップを狙いやすい",
    ],
  },
  {
    slug: "30s-couple-osaka",
    title: "30代夫婦・大阪在住",
    subtitle: "年収600万円の共働き夫婦でFIREへ",
    description:
      "35歳・年収600万円・大阪府在住の夫婦がFIREを目指すモデルケース。大阪の生活費と夫婦での資産形成戦略を解説。",
    age: 35,
    annualIncome: 600,
    prefecture: "osaka",
    familyType: "couple",
    housingType: "rent",
    currentAssets: 500,
    monthlyInvestment: 12,
    keyPoints: [
      "夫婦2人分の生活費と社会保険料で必要資産が大きくなるが、共働きなら貯蓄率を高めやすい",
      "大阪は東京より生活費係数が低く、同じ年収でもFIRE達成が早まる傾向",
      "新NISA枠を夫婦で最大限活用し、年間360万円×2人の非課税投資が可能",
      "FIRE後の国民健康保険料は夫婦で月約2.8万円。事前の準備が重要",
    ],
  },
  {
    slug: "40s-family-nagoya",
    title: "40代子あり・名古屋在住",
    subtitle: "年収700万円で子育てしながらFIREを計画",
    description:
      "42歳・年収700万円・愛知県在住の夫婦＋子1人世帯がFIREを目指すモデルケース。教育費と住宅ローンを考慮した現実的なプラン。",
    age: 42,
    annualIncome: 700,
    prefecture: "aichi",
    familyType: "couple-1child",
    housingType: "own_loan",
    currentAssets: 1000,
    monthlyInvestment: 8,
    keyPoints: [
      "子育て世帯は教育費が大きな変動要因。高校〜大学期の支出増を見込んだ計画が必須",
      "住宅ローン返済中は月々の投資額が限られるが、完済後に積立を増やす二段階戦略が有効",
      "愛知は生活費係数1.00と全国平均並み。製造業の好待遇を活かした資産形成を",
      "完全FIREではなくセミリタイアに切り替えれば、必要資産を大幅に減らせる",
    ],
  },
  {
    slug: "40s-single-fukuoka-sidefire",
    title: "40代独身・福岡でサイドFIRE",
    subtitle: "年収450万円からサイドFIREを実現",
    description:
      "40歳・年収450万円・福岡県在住の独身者がサイドFIRE（FIRE後もパートタイム収入あり）を目指すモデルケース。",
    age: 40,
    annualIncome: 450,
    prefecture: "fukuoka",
    familyType: "single",
    housingType: "rent",
    currentAssets: 800,
    monthlyInvestment: 10,
    keyPoints: [
      "サイドFIREなら必要資産は完全FIREの50〜70%で済む。月5〜10万円の副収入を想定",
      "福岡は生活費係数0.95と全国平均以下。食費・家賃ともに抑えやすい環境",
      "フリーランスやリモートワークとの相性が良く、FIRE後も柔軟に働ける",
      "完全FIREへの移行も視野に入れつつ、まずは経済的な安心感を確保する戦略",
    ],
  },
  {
    slug: "50s-couple-okinawa",
    title: "50代夫婦・沖縄移住プラン",
    subtitle: "年収800万円で地方移住FIREを目指す",
    description:
      "52歳・年収800万円・沖縄県移住を検討中の夫婦がFIREを目指すモデルケース。地方移住による生活コスト削減効果を解説。",
    age: 52,
    annualIncome: 800,
    prefecture: "okinawa",
    familyType: "couple",
    housingType: "own_loan",
    currentAssets: 2500,
    monthlyInvestment: 15,
    keyPoints: [
      "50代からのFIREは蓄積資産が有利。2,500万円のスタートで達成を早められる",
      "沖縄の生活費係数は0.88と低コスト。都市部からの移住で必要資産が大幅減",
      "退職金や企業年金がある場合、実質的なFIRE必要資産はさらに少なくなる",
      "60歳以降は国民年金の支払いが不要に。FIRE後の固定費がさらに下がる点も有利",
    ],
  },
];

export const modelCases: ModelCase[] = caseInputs.map(buildModelCase);

export function getModelCaseBySlug(slug: string): ModelCase | undefined {
  return modelCases.find((c) => c.slug === slug);
}
