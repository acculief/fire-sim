import { runSimulation } from "./calculator";
import type { SimulationInput } from "./types";
import { DEFAULTS, INCOME_LEVELS, FAMILY_TYPES_FOR_SEO } from "@/config/assumptions";

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

/** 地域LPの代表ケースを生成 */
export function generateCaseExamples(prefCode: string): CaseExample[] {
  const cases: { label: string; income: number; family: string; familyLabel: string }[] = [
    { label: "年収400万・独身", income: 400, family: "single", familyLabel: "独身" },
    { label: "年収600万・夫婦", income: 600, family: "couple", familyLabel: "夫婦" },
    { label: "年収800万・夫婦+子1人", income: 800, family: "couple-1child", familyLabel: "夫婦+子1人" },
  ];

  return cases.map((c) => {
    const input: SimulationInput = {
      prefecture: prefCode,
      annualIncome: c.income,
      incomeType: "gross",
      currentAssets: DEFAULTS.currentAssets,
      monthlyInvestment: DEFAULTS.monthlyInvestment,
      familyType: c.family,
      housingType: "rent",
      currentAge: DEFAULTS.currentAge,
      annualReturnRate: DEFAULTS.annualReturnRate,
      swr: DEFAULTS.swr,
      inflationRate: DEFAULTS.inflationRate,
      fireStrategy: DEFAULTS.fireStrategy,
      yieldRate: DEFAULTS.yieldRate,
      dividendTaxRate: DEFAULTS.dividendTaxRate,
    };
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
    const input: SimulationInput = {
      prefecture: prefCode,
      annualIncome: income,
      incomeType: "gross",
      currentAssets: DEFAULTS.currentAssets,
      monthlyInvestment: DEFAULTS.monthlyInvestment,
      familyType: ft.key,
      housingType: "rent",
      currentAge: DEFAULTS.currentAge,
      annualReturnRate: DEFAULTS.annualReturnRate,
      swr: DEFAULTS.swr,
      inflationRate: DEFAULTS.inflationRate,
      fireStrategy: DEFAULTS.fireStrategy,
      yieldRate: DEFAULTS.yieldRate,
      dividendTaxRate: DEFAULTS.dividendTaxRate,
    };
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
    const input: SimulationInput = {
      prefecture: prefCode,
      annualIncome: il.value,
      incomeType: "gross",
      currentAssets: DEFAULTS.currentAssets,
      monthlyInvestment: DEFAULTS.monthlyInvestment,
      familyType,
      housingType: "rent",
      currentAge: DEFAULTS.currentAge,
      annualReturnRate: DEFAULTS.annualReturnRate,
      swr: DEFAULTS.swr,
      inflationRate: DEFAULTS.inflationRate,
      fireStrategy: DEFAULTS.fireStrategy,
      yieldRate: DEFAULTS.yieldRate,
      dividendTaxRate: DEFAULTS.dividendTaxRate,
    };
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
