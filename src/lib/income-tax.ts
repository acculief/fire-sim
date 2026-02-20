/**
 * 日本の給与所得者の手取り計算
 * 2026年（令和8年）の税制に基づく簡易計算
 *
 * 前提:
 * - 給与収入のみ（副業・不動産等なし）
 * - 40歳未満（介護保険料なし）
 * - 協会けんぽ（全国平均）加入
 * - ボーナスなし（年俸を12等分）
 */

/* ------------------------------------------------------------------ */
/*  定数                                                                */
/* ------------------------------------------------------------------ */

/** 個別ページを生成する年収（万円） */
export const INCOME_LEVELS = [
  200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900,
  950, 1000, 1100, 1200, 1300, 1400, 1500, 2000,
] as const;

export type FamilyPattern = "single" | "couple" | "couple-child1";

const FAMILY_LABELS: Record<FamilyPattern, string> = {
  single: "独身",
  couple: "片働き夫婦",
  "couple-child1": "夫婦＋子1人",
};

export const FAMILY_PATTERNS: FamilyPattern[] = [
  "single",
  "couple",
  "couple-child1",
];

export function getFamilyLabel(f: FamilyPattern): string {
  return FAMILY_LABELS[f];
}

/* ------------------------------------------------------------------ */
/*  給与所得控除                                                         */
/* ------------------------------------------------------------------ */

function calcEmploymentDeduction(gross: number): number {
  if (gross <= 1_625_000) return 550_000;
  if (gross <= 1_800_000) return Math.floor(gross * 0.4) - 100_000;
  if (gross <= 3_600_000) return Math.floor(gross * 0.3) + 80_000;
  if (gross <= 6_600_000) return Math.floor(gross * 0.2) + 440_000;
  if (gross <= 8_500_000) return Math.floor(gross * 0.1) + 1_100_000;
  return 1_950_000;
}

/* ------------------------------------------------------------------ */
/*  基礎控除                                                            */
/* ------------------------------------------------------------------ */

function basicDeductionIT(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 480_000;
  if (totalIncome <= 24_500_000) return 320_000;
  if (totalIncome <= 25_000_000) return 160_000;
  return 0;
}

function basicDeductionRT(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 430_000;
  if (totalIncome <= 24_500_000) return 290_000;
  if (totalIncome <= 25_000_000) return 150_000;
  return 0;
}

/* ------------------------------------------------------------------ */
/*  社会保険料（従業員負担分）                                              */
/* ------------------------------------------------------------------ */

interface SocialInsuranceBreakdown {
  health: number;
  pension: number;
  employment: number;
  total: number;
}

function calcSocialInsurance(gross: number): SocialInsuranceBreakdown {
  // 健康保険: 協会けんぽ全国平均 約5.0%（事業主と折半後）
  const health = Math.floor(gross * 0.05);

  // 厚生年金: 9.15%（上限: 標準報酬月額65万 → 年間上限 713,700円）
  const pensionCap = 713_700;
  const pension = Math.min(Math.floor(gross * 0.0915), pensionCap);

  // 雇用保険: 0.6%（一般事業 2026年度）
  const employment = Math.floor(gross * 0.006);

  return { health, pension, employment, total: health + pension + employment };
}

/* ------------------------------------------------------------------ */
/*  所得税                                                              */
/* ------------------------------------------------------------------ */

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let tax: number;
  if (taxableIncome <= 1_950_000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3_300_000) {
    tax = taxableIncome * 0.1 - 97_500;
  } else if (taxableIncome <= 6_950_000) {
    tax = taxableIncome * 0.2 - 427_500;
  } else if (taxableIncome <= 9_000_000) {
    tax = taxableIncome * 0.23 - 636_000;
  } else if (taxableIncome <= 18_000_000) {
    tax = taxableIncome * 0.33 - 1_536_000;
  } else if (taxableIncome <= 40_000_000) {
    tax = taxableIncome * 0.4 - 2_796_000;
  } else {
    tax = taxableIncome * 0.45 - 4_796_000;
  }

  // 復興特別所得税 2.1%（2037年まで）
  return Math.floor(tax * 1.021);
}

/* ------------------------------------------------------------------ */
/*  住民税                                                              */
/* ------------------------------------------------------------------ */

function calcResidentTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  // 所得割 10% ＋ 均等割 5,000円 ＋ 森林環境税 1,000円
  return Math.floor(taxableIncome * 0.1) + 6_000;
}

/* ------------------------------------------------------------------ */
/*  手取り計算（メイン関数）                                                */
/* ------------------------------------------------------------------ */

export interface TakeHomeResult {
  grossAnnual: number;
  employmentDeduction: number;
  totalIncome: number;
  socialInsurance: SocialInsuranceBreakdown;
  incomeTax: number;
  residentTax: number;
  totalDeductions: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
  takeHomeRate: number;
}

export function calcTakeHome(
  grossAnnualYen: number,
  family: FamilyPattern = "single",
): TakeHomeResult {
  const employmentDeduction = calcEmploymentDeduction(grossAnnualYen);
  const totalIncome = grossAnnualYen - employmentDeduction;

  const si = calcSocialInsurance(grossAnnualYen);

  // 家族構成に応じた追加控除
  // 配偶者控除は納税者の合計所得金額に応じて段階的に縮小
  //   900万以下: 満額、900万超950万以下: 26万/22万、950万超1000万以下: 13万/11万、1000万超: 0
  let spouseDedIT = 0;
  let spouseDedRT = 0;
  if (family !== "single") {
    if (totalIncome <= 9_000_000) {
      spouseDedIT = 380_000;
      spouseDedRT = 330_000;
    } else if (totalIncome <= 9_500_000) {
      spouseDedIT = 260_000;
      spouseDedRT = 220_000;
    } else if (totalIncome <= 10_000_000) {
      spouseDedIT = 130_000;
      spouseDedRT = 110_000;
    }
    // 1000万超は配偶者控除なし
  }

  // 扶養控除（16歳以上の子）は所得制限なし
  const dependentDedIT = family === "couple-child1" ? 380_000 : 0;
  const dependentDedRT = family === "couple-child1" ? 330_000 : 0;

  const familyDedIT = spouseDedIT + dependentDedIT;
  const familyDedRT = spouseDedRT + dependentDedRT;

  // 課税所得（所得税）
  const taxableIT = Math.max(
    0,
    totalIncome - basicDeductionIT(totalIncome) - si.total - familyDedIT,
  );

  // 課税所得（住民税）
  const taxableRT = Math.max(
    0,
    totalIncome - basicDeductionRT(totalIncome) - si.total - familyDedRT,
  );

  const incomeTax = calcIncomeTax(taxableIT);
  const residentTax = calcResidentTax(taxableRT);
  const totalDeductions = si.total + incomeTax + residentTax;
  const takeHomeAnnual = grossAnnualYen - totalDeductions;

  return {
    grossAnnual: grossAnnualYen,
    employmentDeduction,
    totalIncome,
    socialInsurance: si,
    incomeTax,
    residentTax,
    totalDeductions,
    takeHomeAnnual,
    takeHomeMonthly: Math.round(takeHomeAnnual / 12),
    takeHomeRate:
      Math.round((takeHomeAnnual / grossAnnualYen) * 100 * 10) / 10,
  };
}
