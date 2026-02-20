import {
  BASE_MONTHLY_COST,
  FAMILY_COEFFICIENTS,
  HOUSING_COEFFICIENTS,
  SCENARIOS,
  FIRE_STRATEGIES,
  grossToNet,
  estimatePostFireMonthlyCost,
} from "@/config/assumptions";
import { getPrefectureByCode } from "@/data/prefectures";
import type {
  SimulationInput,
  SimulationResult,
  ScenarioResult,
  YearProjection,
  SensitivityItem,
  FamilyType,
  HousingType,
} from "./types";

const MAX_SIMULATION_YEARS = 80;

/** 月間生活費を推定（万円） */
export function estimateMonthlyExpense(
  costIndex: number,
  familyType: string,  // string for flexibility with SEO pages that iterate keys
  housingType: string, // string for flexibility with SEO pages that iterate keys
): number {
  const familyCoeff = FAMILY_COEFFICIENTS[familyType]?.coefficient ?? 1.0;
  const housingCoeff = HOUSING_COEFFICIENTS[housingType]?.coefficient ?? 1.0;
  return BASE_MONTHLY_COST * costIndex * familyCoeff * housingCoeff;
}

/** FIRE必要資産（万円） */
export function calcFireNumber(annualExpense: number, swr: number): number {
  if (swr <= 0) return Infinity;
  return annualExpense / swr;
}

/** 達成年数を計算（複利積立） */
export function calcAchievementYears(
  currentAssets: number,
  annualInvestment: number,
  annualReturnRate: number,
  fireNumber: number,
  inflationRate: number,
  maxYears: number = MAX_SIMULATION_YEARS,
): { years: number | null; projection: YearProjection[] } {
  const projection: YearProjection[] = [];
  let assets = currentAssets;
  let target = fireNumber;

  for (let year = 0; year <= maxYears; year++) {
    projection.push({
      age: 0,
      year,
      assets: Math.round(assets),
      fireNumber: Math.round(target),
      annualInvestment,
    });

    if (assets >= target && year > 0) {
      return { years: year, projection };
    }

    assets = assets * (1 + annualReturnRate) + annualInvestment;
    target = target * (1 + inflationRate);
  }

  return { years: null, projection };
}

/** 税引後の実効利回りを計算 */
export function calcEffectiveYieldRate(
  grossYieldRate: number,
  taxRate: number,
): number {
  return grossYieldRate * (1 - taxRate);
}

/** ストラテジーに応じたFIRE必要資産を計算 */
function calcFireNumberForStrategy(
  annualExpense: number,
  input: SimulationInput,
): number {
  if (input.fireStrategy === "yield") {
    // 利回り運用: 税引後の配当/利息のみで生活、元本維持
    const effectiveRate = calcEffectiveYieldRate(
      input.yieldRate,
      input.dividendTaxRate,
    );
    if (effectiveRate <= 0) return Infinity;
    return annualExpense / effectiveRate;
  }
  // 取り崩し: SWRで取り崩し
  return calcFireNumber(annualExpense, input.swr);
}

/** シナリオ別計算 */
function calcScenario(
  scenarioKey: keyof typeof SCENARIOS,
  baseMonthlyExpense: number,
  postFireMonthlyCost: number,
  input: SimulationInput,
): ScenarioResult {
  const scenario = SCENARIOS[scenarioKey];
  const adjustedLivingExpense =
    baseMonthlyExpense * (1 + scenario.expenseAdjust);
  // 月間支出 = 生活費 + FIRE後社会保険料
  const adjustedMonthlyExpense = adjustedLivingExpense + postFireMonthlyCost;
  const annualExpense = adjustedMonthlyExpense * 12;
  const fireNumber = calcFireNumberForStrategy(annualExpense, input);
  const returnRate = input.annualReturnRate + scenario.returnRateAdjust;
  const annualInvestment = input.monthlyInvestment * 12;

  const { years, projection } = calcAchievementYears(
    input.currentAssets,
    annualInvestment,
    returnRate,
    fireNumber,
    input.inflationRate,
  );

  const projectionWithAge = projection.map((p) => ({
    ...p,
    age: input.currentAge + p.year,
  }));

  return {
    label: scenario.label,
    color: scenario.color,
    fireNumber: Math.round(fireNumber),
    monthlyExpense: Math.round(adjustedMonthlyExpense * 10) / 10,
    annualExpense: Math.round(annualExpense),
    achievementAge: years !== null ? input.currentAge + years : null,
    achievementYears: years,
    yearlyProjection: projectionWithAge,
  };
}

/** 感度分析アイテムを生成するヘルパー */
function makeSensitivityItem(
  label: string,
  description: string,
  newYears: number | null,
  neutralYears: number | null,
): SensitivityItem {
  return {
    label,
    description,
    currentYears: neutralYears,
    newYears,
    diff:
      neutralYears !== null && newYears !== null
        ? newYears - neutralYears
        : null,
  };
}

/** 感度分析 */
function calcSensitivity(
  baseMonthlyExpense: number,
  postFireMonthlyCost: number,
  input: SimulationInput,
  neutralYears: number | null,
): SensitivityItem[] {
  const totalMonthly = baseMonthlyExpense + postFireMonthlyCost;
  const annualExpense = totalMonthly * 12;
  const fireNumber = calcFireNumberForStrategy(annualExpense, input);
  const annualInvestment = input.monthlyInvestment * 12;

  const items: SensitivityItem[] = [];

  // 積立+1万円
  const extraInvest = calcAchievementYears(
    input.currentAssets, annualInvestment + 12,
    input.annualReturnRate, fireNumber, input.inflationRate,
  );
  items.push(makeSensitivityItem(
    "積立 +1万円/月", `月${input.monthlyInvestment + 1}万円に増額`,
    extraInvest.years, neutralYears,
  ));

  // 積立+3万円
  const extraInvest3 = calcAchievementYears(
    input.currentAssets, annualInvestment + 36,
    input.annualReturnRate, fireNumber, input.inflationRate,
  );
  items.push(makeSensitivityItem(
    "積立 +3万円/月", `月${input.monthlyInvestment + 3}万円に増額`,
    extraInvest3.years, neutralYears,
  ));

  // 利回り+1%
  const higherReturn = calcAchievementYears(
    input.currentAssets, annualInvestment,
    input.annualReturnRate + 0.01, fireNumber, input.inflationRate,
  );
  items.push(makeSensitivityItem(
    "利回り +1%", `年率${((input.annualReturnRate + 0.01) * 100).toFixed(0)}%`,
    higherReturn.years, neutralYears,
  ));

  // 支出-10%（生活費部分のみ10%削減、社会保険料はそのまま）
  const lowerLivingAnnual = baseMonthlyExpense * 0.9 * 12 + postFireMonthlyCost * 12;
  const lowerExpenseFireNumber = calcFireNumberForStrategy(lowerLivingAnnual, input);
  const lowerExpense = calcAchievementYears(
    input.currentAssets, annualInvestment,
    input.annualReturnRate, lowerExpenseFireNumber, input.inflationRate,
  );
  items.push(makeSensitivityItem(
    "支出 -10%", "生活費を10%削減",
    lowerExpense.years, neutralYears,
  ));

  // ストラテジー切り替え比較
  if (input.fireStrategy === "withdrawal") {
    const yieldInput = { ...input, fireStrategy: "yield" as const };
    const yieldFireNumber = calcFireNumberForStrategy(annualExpense, yieldInput);
    const yieldResult = calcAchievementYears(
      input.currentAssets, annualInvestment,
      input.annualReturnRate, yieldFireNumber, input.inflationRate,
    );
    items.push(makeSensitivityItem(
      "利回り運用に変更", `元本維持（利回り${(input.yieldRate * 100).toFixed(1)}%）`,
      yieldResult.years, neutralYears,
    ));
  } else {
    const swrInput = { ...input, fireStrategy: "withdrawal" as const };
    const swrFireNumber = calcFireNumberForStrategy(annualExpense, swrInput);
    const swrResult = calcAchievementYears(
      input.currentAssets, annualInvestment,
      input.annualReturnRate, swrFireNumber, input.inflationRate,
    );
    items.push(makeSensitivityItem(
      "取り崩しに変更", `SWR ${(input.swr * 100).toFixed(1)}%で取り崩し`,
      swrResult.years, neutralYears,
    ));
  }

  return items;
}

/** メインのシミュレーション実行 */
export function runSimulation(input: SimulationInput): SimulationResult {
  const pref = getPrefectureByCode(input.prefecture);
  const costIndex = pref?.costIndex ?? 1.0;
  const prefectureName = pref?.name ?? input.prefecture;

  const familyLabel =
    FAMILY_COEFFICIENTS[input.familyType]?.label ?? input.familyType;
  const housingLabel =
    HOUSING_COEFFICIENTS[input.housingType]?.label ?? input.housingType;
  const strategyLabel =
    FIRE_STRATEGIES[input.fireStrategy]?.shortLabel ?? "取り崩し";

  const estimatedMonthlyExpense = estimateMonthlyExpense(
    costIndex,
    input.familyType,
    input.housingType,
  );
  const baseMonthlyExpense =
    input.customMonthlyExpense != null && input.customMonthlyExpense > 0
      ? input.customMonthlyExpense
      : estimatedMonthlyExpense;

  // FIRE後の社会保険料（国保+年金）
  const postFireMonthlyCost =
    input.postFireMonthlyCost != null && input.postFireMonthlyCost >= 0
      ? input.postFireMonthlyCost
      : estimatePostFireMonthlyCost(input.familyType);

  // 税引後の実効利回り（利回り運用の場合のみ意味あり）
  const effectiveYieldRate =
    input.fireStrategy === "yield"
      ? calcEffectiveYieldRate(input.yieldRate, input.dividendTaxRate)
      : null;

  const optimistic = calcScenario("optimistic", baseMonthlyExpense, postFireMonthlyCost, input);
  const neutral = calcScenario("neutral", baseMonthlyExpense, postFireMonthlyCost, input);
  const pessimistic = calcScenario("pessimistic", baseMonthlyExpense, postFireMonthlyCost, input);

  const sensitivity = calcSensitivity(
    baseMonthlyExpense,
    postFireMonthlyCost,
    input,
    neutral.achievementYears,
  );

  return {
    input,
    prefectureName,
    costIndex,
    familyLabel,
    housingLabel,
    strategyLabel,
    baseMonthlyExpense: Math.round(baseMonthlyExpense * 10) / 10,
    postFireMonthlyCost: Math.round(postFireMonthlyCost * 10) / 10,
    effectiveYieldRate,
    scenarios: { optimistic, neutral, pessimistic },
    sensitivity,
  };
}

/** URLクエリパラメータからSimulationInputを復元 */
export function inputFromParams(
  params: Record<string, string>,
): SimulationInput {
  return {
    prefecture: params.pref ?? "tokyo",
    annualIncome: Number(params.income) || 500,
    incomeType: params.incomeType === "net" ? "net" : "gross",
    currentAssets: Number(params.assets) || 300,
    monthlyInvestment: Number(params.invest) || 10,
    familyType: (params.family ?? "single") as FamilyType,
    housingType: (params.housing ?? "rent") as HousingType,
    currentAge: Number(params.age) || 30,
    targetAge: params.targetAge ? Number(params.targetAge) : undefined,
    annualReturnRate: Number(params.return) || 0.04,
    swr: Number(params.swr) || 0.04,
    inflationRate: Number(params.inflation) || 0.02,
    fireStrategy: params.strategy === "yield" ? "yield" : "withdrawal",
    yieldRate: Number(params.yieldRate) || 0.03,
    customMonthlyExpense: params.expense ? Number(params.expense) : undefined,
    dividendTaxRate: params.taxRate ? Number(params.taxRate) : 0.20,
    postFireMonthlyCost: params.insuranceCost ? Number(params.insuranceCost) : undefined,
  };
}

/** SimulationInputをURLクエリパラメータに変換 */
export function inputToParams(input: SimulationInput): string {
  const p = new URLSearchParams();
  p.set("pref", input.prefecture);
  p.set("income", String(input.annualIncome));
  p.set("incomeType", input.incomeType);
  p.set("assets", String(input.currentAssets));
  p.set("invest", String(input.monthlyInvestment));
  p.set("family", input.familyType);
  p.set("housing", input.housingType);
  p.set("age", String(input.currentAge));
  if (input.targetAge) p.set("targetAge", String(input.targetAge));
  p.set("return", String(input.annualReturnRate));
  p.set("swr", String(input.swr));
  p.set("inflation", String(input.inflationRate));
  p.set("strategy", input.fireStrategy);
  p.set("yieldRate", String(input.yieldRate));
  if (input.customMonthlyExpense != null && input.customMonthlyExpense > 0) {
    p.set("expense", String(input.customMonthlyExpense));
  }
  p.set("taxRate", String(input.dividendTaxRate));
  if (input.postFireMonthlyCost != null && input.postFireMonthlyCost >= 0) {
    p.set("insuranceCost", String(input.postFireMonthlyCost));
  }
  return p.toString();
}
