/** 全国基準の月間生活費（独身、賃貸）単位：万円 */
export const BASE_MONTHLY_COST = 18;

/** 家族係数 */
export const FAMILY_COEFFICIENTS: Record<string, { label: string; coefficient: number }> = {
  single: { label: "独身", coefficient: 1.0 },
  couple: { label: "夫婦", coefficient: 1.3 },
  "couple-1child": { label: "夫婦＋子1人", coefficient: 1.55 },
  "couple-2children": { label: "夫婦＋子2人", coefficient: 1.75 },
  "couple-3children": { label: "夫婦＋子3人", coefficient: 1.95 },
};

/** 住宅係数 */
export const HOUSING_COEFFICIENTS: Record<string, { label: string; coefficient: number }> = {
  rent: { label: "賃貸", coefficient: 1.0 },
  own: { label: "持ち家（ローン完済）", coefficient: 0.85 },
  own_loan: { label: "持ち家（ローン有）", coefficient: 1.05 },
};

/** FIREストラテジー定義 */
export const FIRE_STRATEGIES = {
  withdrawal: {
    label: "取り崩し（SWR）",
    shortLabel: "取り崩し",
    description: "資産を毎年一定率で取り崩して生活。元本は徐々に減少するが、必要資産が少なく済む。",
  },
  yield: {
    label: "利回り運用（配当・利息）",
    shortLabel: "利回り運用",
    description: "配当金や利息のみで生活し、元本を維持。必要資産は多いが、資産が減らない安心感がある。",
  },
} as const;

/**
 * FIRE後の社会保険料（国民健康保険 + 国民年金）
 * 国保: 所得割+均等割+平等割の概算。FIRE後は配当/譲渡所得のみで計算。
 *       ここでは家族構成ベースの概算値を使用。
 * 国民年金: 2026年度 月額約17,510円/人（60歳未満）
 */
export const POST_FIRE_INSURANCE = {
  /** 国民健康保険 月額概算（万円）: 家族構成別 */
  healthInsurance: {
    single: 1.5,
    couple: 2.8,
    "couple-1child": 3.3,
    "couple-2children": 3.8,
    "couple-3children": 4.3,
  } as Record<string, number>,
  /** 国民年金 月額/人（万円） */
  nationalPensionPerPerson: 1.8,
  /** 国民年金の対象年齢上限 */
  pensionMaxAge: 60,
};

/** 配当・運用益にかかる税率（簡易: 約20%） */
export const DEFAULT_DIVIDEND_TAX_RATE = 0.20;

/** デフォルトパラメータ */
export const DEFAULTS = {
  annualReturnRate: 0.04,
  swr: 0.04,
  inflationRate: 0.02,
  yieldRate: 0.03,
  dividendTaxRate: DEFAULT_DIVIDEND_TAX_RATE,
  fireStrategy: "withdrawal" as "withdrawal" | "yield",
  currentAge: 30,
  targetAge: 50,
  annualIncome: 500,
  currentAssets: 300,
  monthlyInvestment: 10,
  prefecture: "tokyo",
  familyType: "single",
  housingType: "rent",
  incomeType: "gross" as "gross" | "net",
};

/** FIRE後の社会保険料を推定（万円/月） */
export function estimatePostFireMonthlyCost(
  familyType: string,
): number {
  const healthIns =
    POST_FIRE_INSURANCE.healthInsurance[familyType] ??
    POST_FIRE_INSURANCE.healthInsurance["single"];
  const people = familyType === "single" ? 1 : 2;
  const pension = POST_FIRE_INSURANCE.nationalPensionPerPerson * people;
  return Math.round((healthIns + pension) * 10) / 10;
}

/** シナリオ設定 */
export const SCENARIOS = {
  optimistic: {
    label: "楽観",
    returnRateAdjust: 0.02,
    expenseAdjust: -0.05,
    color: "#22c55e",
  },
  neutral: {
    label: "中立",
    returnRateAdjust: 0,
    expenseAdjust: 0,
    color: "#3b82f6",
  },
  pessimistic: {
    label: "悲観",
    returnRateAdjust: -0.02,
    expenseAdjust: 0.10,
    color: "#ef4444",
  },
} as const;

/** 額面→手取りの簡易変換（税率・社保を概算） */
export function grossToNet(grossAnnual: number): number {
  if (grossAnnual <= 300) return grossAnnual * 0.80;
  if (grossAnnual <= 500) return grossAnnual * 0.77;
  if (grossAnnual <= 700) return grossAnnual * 0.74;
  if (grossAnnual <= 1000) return grossAnnual * 0.70;
  return grossAnnual * 0.65;
}

/** 年収帯のラベル */
export const INCOME_LEVELS = [
  { value: 300, label: "300万円" },
  { value: 400, label: "400万円" },
  { value: 500, label: "500万円" },
  { value: 600, label: "600万円" },
  { value: 700, label: "700万円" },
  { value: 800, label: "800万円" },
  { value: 1000, label: "1000万円" },
  { value: 1200, label: "1200万円" },
  { value: 1500, label: "1500万円" },
];

/** SEO用の家族構成タイプ */
export const FAMILY_TYPES_FOR_SEO = [
  { key: "single", label: "独身" },
  { key: "couple", label: "夫婦" },
  { key: "couple-1child", label: "夫婦＋子1人" },
  { key: "couple-2children", label: "夫婦＋子2人" },
];

/** SEO用の年代グループ */
export const AGE_GROUPS_FOR_SEO = [
  { slug: "20s", label: "20代", representativeAge: 25, currentAssets: 100, monthlyInvestment: 5 },
  { slug: "30s", label: "30代", representativeAge: 35, currentAssets: 300, monthlyInvestment: 10 },
  { slug: "40s", label: "40代", representativeAge: 45, currentAssets: 800, monthlyInvestment: 15 },
  { slug: "50s", label: "50代", representativeAge: 55, currentAssets: 1500, monthlyInvestment: 15 },
];

/** SEO用の住宅タイプ */
export const HOUSING_TYPES_FOR_SEO = [
  { key: "rent", label: "賃貸" },
  { key: "own", label: "持ち家（ローン完済）" },
  { key: "own_loan", label: "持ち家（ローン有）" },
];

/** 地方のslug↔日本語マッピング */
export const REGION_SLUGS = [
  { slug: "hokkaido", label: "北海道" },
  { slug: "tohoku", label: "東北" },
  { slug: "kanto", label: "関東" },
  { slug: "chubu", label: "中部" },
  { slug: "kinki", label: "近畿" },
  { slug: "chugoku", label: "中国" },
  { slug: "shikoku", label: "四国" },
  { slug: "kyushu", label: "九州" },
];
