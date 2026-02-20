import { runSimulation } from "./calculator";
import type { SimulationInput, FamilyType, HousingType } from "./types";
import {
  DEFAULTS,
  INCOME_LEVELS,
  FAMILY_TYPES_FOR_SEO,
  AGE_GROUPS_FOR_SEO,
  HOUSING_TYPES_FOR_SEO,
  HOUSING_COEFFICIENTS,
} from "@/config/assumptions";
import { prefectures } from "@/data/prefectures";

/** 特定条件でのシミュレーション結果概要 */
export interface CaseExample {
  label: string;
  annualIncome: number;
  familyType: string;
  familyLabel: string;
  fireNumber: number;
  achievementAge: number | null;
  monthlyExpense: number;
}

/** DEFAULTS をベースに部分上書きした SimulationInput を生成 */
function createBaseInput(overrides: Partial<SimulationInput>): SimulationInput {
  return {
    prefecture: "",
    annualIncome: 500,
    incomeType: "gross",
    currentAssets: DEFAULTS.currentAssets,
    monthlyInvestment: DEFAULTS.monthlyInvestment,
    familyType: "single",
    housingType: "rent",
    currentAge: DEFAULTS.currentAge,
    annualReturnRate: DEFAULTS.annualReturnRate,
    swr: DEFAULTS.swr,
    inflationRate: DEFAULTS.inflationRate,
    fireStrategy: DEFAULTS.fireStrategy,
    yieldRate: DEFAULTS.yieldRate,
    dividendTaxRate: DEFAULTS.dividendTaxRate,
    ...overrides,
  };
}

/** 地域LPの代表ケースを生成 */
export function generateCaseExamples(prefCode: string): CaseExample[] {
  const cases: { label: string; income: number; family: string; familyLabel: string }[] = [
    { label: "年収400万・独身", income: 400, family: "single", familyLabel: "独身" },
    { label: "年収600万・夫婦", income: 600, family: "couple", familyLabel: "夫婦" },
    { label: "年収800万・夫婦+子1人", income: 800, family: "couple-1child", familyLabel: "夫婦+子1人" },
  ];

  return cases.map((c) => {
    const input = createBaseInput({
      prefecture: prefCode,
      annualIncome: c.income,
      familyType: c.family as FamilyType,
    });
    const result = runSimulation(input);
    const neutral = result.scenarios.neutral;

    return {
      label: c.label,
      annualIncome: c.income,
      familyType: c.family,
      familyLabel: c.familyLabel,
      fireNumber: neutral.fireNumber,
      achievementAge: neutral.achievementAge,
      monthlyExpense: neutral.monthlyExpense,
    };
  });
}

/** 年収別のケースを生成 */
export function generateIncomeCases(prefCode: string, income: number) {
  return FAMILY_TYPES_FOR_SEO.map((ft) => {
    const input = createBaseInput({
      prefecture: prefCode,
      annualIncome: income,
      familyType: ft.key as FamilyType,
    });
    const result = runSimulation(input);
    const neutral = result.scenarios.neutral;
    return {
      label: ft.label,
      familyType: ft.key,
      fireNumber: neutral.fireNumber,
      achievementAge: neutral.achievementAge,
      monthlyExpense: neutral.monthlyExpense,
    };
  });
}

/** 家族構成別のケースを生成 */
export function generateFamilyCases(prefCode: string, familyType: string) {
  return INCOME_LEVELS.slice(0, 5).map((il) => {
    const input = createBaseInput({
      prefecture: prefCode,
      annualIncome: il.value,
      familyType: familyType as FamilyType,
    });
    const result = runSimulation(input);
    const neutral = result.scenarios.neutral;
    return {
      label: il.label,
      annualIncome: il.value,
      fireNumber: neutral.fireNumber,
      achievementAge: neutral.achievementAge,
      monthlyExpense: neutral.monthlyExpense,
    };
  });
}

/** 年代別の初期資産を推定 */
export function estimateAssetsByAge(ageSlug: string) {
  const group = AGE_GROUPS_FOR_SEO.find((g) => g.slug === ageSlug);
  if (!group) return { currentAssets: DEFAULTS.currentAssets, monthlyInvestment: DEFAULTS.monthlyInvestment, currentAge: DEFAULTS.currentAge };
  return {
    currentAssets: group.currentAssets,
    monthlyInvestment: group.monthlyInvestment,
    currentAge: group.representativeAge,
  };
}

/** 年代×都道府県のシミュレーション結果生成（年収別に比較） */
export function generateAgeCases(prefCode: string, ageSlug: string) {
  const { currentAssets, monthlyInvestment, currentAge } = estimateAssetsByAge(ageSlug);
  return INCOME_LEVELS.slice(0, 5).map((il) => {
    const input = createBaseInput({
      prefecture: prefCode,
      annualIncome: il.value,
      currentAssets,
      monthlyInvestment,
      currentAge,
    });
    const result = runSimulation(input);
    const neutral = result.scenarios.neutral;
    return {
      label: il.label,
      annualIncome: il.value,
      fireNumber: neutral.fireNumber,
      achievementAge: neutral.achievementAge,
      monthlyExpense: neutral.monthlyExpense,
      currentAge,
      currentAssets,
      monthlyInvestment,
    };
  });
}

/** 住宅×都道府県のシミュレーション結果生成（年収別に比較） */
export function generateHousingCases(prefCode: string, housingType: string) {
  return INCOME_LEVELS.slice(0, 5).map((il) => {
    const input = createBaseInput({
      prefecture: prefCode,
      annualIncome: il.value,
      housingType: housingType as HousingType,
    });
    const result = runSimulation(input);
    const neutral = result.scenarios.neutral;
    return {
      label: il.label,
      annualIncome: il.value,
      fireNumber: neutral.fireNumber,
      achievementAge: neutral.achievementAge,
      monthlyExpense: neutral.monthlyExpense,
    };
  });
}

/** 住宅タイプ間のミニ比較（特定年収での3タイプ比較） */
export function generateHousingComparison(prefCode: string, income: number) {
  return HOUSING_TYPES_FOR_SEO.map((ht) => {
    const input = createBaseInput({
      prefecture: prefCode,
      annualIncome: income,
      housingType: ht.key as HousingType,
    });
    const result = runSimulation(input);
    const neutral = result.scenarios.neutral;
    return {
      label: ht.label,
      housingType: ht.key,
      coefficient: HOUSING_COEFFICIENTS[ht.key]?.coefficient ?? 1.0,
      fireNumber: neutral.fireNumber,
      achievementAge: neutral.achievementAge,
      monthlyExpense: neutral.monthlyExpense,
    };
  });
}

/** 地方内の都道府県比較データ生成 */
export function generateRegionComparison(regionLabel: string) {
  const regionPrefs = prefectures
    .filter((p) => p.region === regionLabel)
    .sort((a, b) => a.costIndex - b.costIndex);

  return regionPrefs.map((p) => {
    const input = createBaseInput({
      prefecture: p.code,
      annualIncome: 500,
    });
    const result = runSimulation(input);
    const neutral = result.scenarios.neutral;
    return {
      code: p.code,
      name: p.name,
      costIndex: p.costIndex,
      fireNumber: neutral.fireNumber,
      achievementAge: neutral.achievementAge,
      monthlyExpense: neutral.monthlyExpense,
    };
  });
}
