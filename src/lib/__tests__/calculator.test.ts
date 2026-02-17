import { describe, it, expect } from "vitest";
import {
  estimateMonthlyExpense,
  calcFireNumber,
  calcAchievementYears,
  calcEffectiveYieldRate,
  runSimulation,
  inputFromParams,
  inputToParams,
} from "../calculator";
import type { SimulationInput } from "../types";

const baseInput: SimulationInput = {
  prefecture: "tokyo",
  annualIncome: 500,
  incomeType: "gross",
  currentAssets: 300,
  monthlyInvestment: 10,
  familyType: "single",
  housingType: "rent",
  currentAge: 30,
  annualReturnRate: 0.04,
  swr: 0.04,
  inflationRate: 0.02,
  fireStrategy: "withdrawal",
  yieldRate: 0.03,
  dividendTaxRate: 0.20,
};

describe("estimateMonthlyExpense", () => {
  it("東京・独身・賃貸で基準の1.25倍", () => {
    const result = estimateMonthlyExpense(1.25, "single", "rent");
    expect(result).toBe(18 * 1.25 * 1.0 * 1.0);
  });

  it("地方・夫婦+子1人・持ち家で正しく計算", () => {
    const result = estimateMonthlyExpense(0.9, "couple-1child", "own");
    expect(result).toBeCloseTo(18 * 0.9 * 1.55 * 0.85, 1);
  });
});

describe("calcFireNumber", () => {
  it("年間支出360万、SWR4%で9000万", () => {
    expect(calcFireNumber(360, 0.04)).toBe(9000);
  });

  it("SWR0ならInfinity", () => {
    expect(calcFireNumber(360, 0)).toBe(Infinity);
  });
});

describe("calcEffectiveYieldRate", () => {
  it("税率20%で3%の利回りが2.4%になる", () => {
    const effective = calcEffectiveYieldRate(0.03, 0.20);
    expect(effective).toBeCloseTo(0.024, 5);
  });

  it("税率0%なら利回りそのまま", () => {
    expect(calcEffectiveYieldRate(0.03, 0)).toBe(0.03);
  });
});

describe("calcAchievementYears", () => {
  it("既に必要資産を超えていれば1年で達成", () => {
    const { years } = calcAchievementYears(10000, 100, 0.04, 5000, 0.02);
    expect(years).toBe(1);
  });

  it("資産0、投資0なら達成不可", () => {
    const { years } = calcAchievementYears(0, 0, 0.04, 5000, 0.02);
    expect(years).toBeNull();
  });

  it("年間120万積立、利回り4%で現実的な年数で達成", () => {
    const { years } = calcAchievementYears(300, 120, 0.04, 5400, 0.02);
    expect(years).not.toBeNull();
    expect(years!).toBeGreaterThan(10);
    expect(years!).toBeLessThan(50);
  });
});

describe("runSimulation - withdrawal strategy", () => {
  it("東京の結果が返る", () => {
    const result = runSimulation(baseInput);

    expect(result.prefectureName).toBe("東京都");
    expect(result.costIndex).toBe(1.25);
    expect(result.strategyLabel).toBe("取り崩し");
    expect(result.scenarios.neutral.fireNumber).toBeGreaterThan(0);
    expect(result.scenarios.optimistic.fireNumber).toBeLessThan(
      result.scenarios.pessimistic.fireNumber,
    );
  });

  it("楽観は悲観より早く達成する", () => {
    const result = runSimulation({
      ...baseInput,
      prefecture: "osaka",
      annualIncome: 600,
      currentAssets: 500,
      monthlyInvestment: 15,
      familyType: "couple",
    });

    const opt = result.scenarios.optimistic.achievementYears;
    const pes = result.scenarios.pessimistic.achievementYears;
    if (opt !== null && pes !== null) {
      expect(opt).toBeLessThan(pes);
    }
  });

  it("感度分析が5項目返る（ストラテジー切替含む）", () => {
    const result = runSimulation(baseInput);
    expect(result.sensitivity).toHaveLength(5);
  });
});

describe("runSimulation - yield strategy", () => {
  const yieldInput: SimulationInput = {
    ...baseInput,
    fireStrategy: "yield",
    yieldRate: 0.03,
  };

  it("利回り運用ではSWRより必要資産が大きい", () => {
    const withdrawalResult = runSimulation(baseInput);
    const yieldResult = runSimulation(yieldInput);

    expect(yieldResult.strategyLabel).toBe("利回り運用");
    expect(yieldResult.scenarios.neutral.fireNumber).toBeGreaterThan(
      withdrawalResult.scenarios.neutral.fireNumber,
    );
  });

  it("利回り運用では達成年齢が遅くなる", () => {
    const withdrawalResult = runSimulation(baseInput);
    const yieldResult = runSimulation(yieldInput);

    const wAge = withdrawalResult.scenarios.neutral.achievementAge;
    const yAge = yieldResult.scenarios.neutral.achievementAge;
    if (wAge !== null && yAge !== null) {
      expect(yAge).toBeGreaterThanOrEqual(wAge);
    }
  });

  it("感度分析に取り崩し切替が含まれる", () => {
    const result = runSimulation(yieldInput);
    expect(result.sensitivity).toHaveLength(5);
    const switchItem = result.sensitivity.find((s) =>
      s.label.includes("取り崩し"),
    );
    expect(switchItem).toBeDefined();
  });

  it("税引後の実効利回りが反映される", () => {
    const result = runSimulation(yieldInput);
    expect(result.effectiveYieldRate).not.toBeNull();
    expect(result.effectiveYieldRate!).toBeCloseTo(0.03 * (1 - 0.20), 4);
  });

  it("税率0%なら税引前と同じ必要資産", () => {
    const noTax = runSimulation({ ...yieldInput, dividendTaxRate: 0 });
    const withTax = runSimulation(yieldInput);
    // 税率0%の方が実効利回りが高いので必要資産が少ない
    expect(noTax.scenarios.neutral.fireNumber).toBeLessThan(
      withTax.scenarios.neutral.fireNumber,
    );
  });

  it("FIRE後社会保険料が結果に含まれる", () => {
    const result = runSimulation(yieldInput);
    expect(result.postFireMonthlyCost).toBeGreaterThan(0);
  });
});

describe("inputFromParams / inputToParams", () => {
  it("ラウンドトリップで値が保持される", () => {
    const input: SimulationInput = {
      ...baseInput,
      prefecture: "osaka",
      annualIncome: 600,
      currentAssets: 500,
      monthlyInvestment: 15,
      familyType: "couple",
      currentAge: 35,
      targetAge: 50,
      annualReturnRate: 0.05,
    };

    const queryString = inputToParams(input);
    const params = Object.fromEntries(new URLSearchParams(queryString));
    const restored = inputFromParams(params);

    expect(restored.prefecture).toBe(input.prefecture);
    expect(restored.annualIncome).toBe(input.annualIncome);
    expect(restored.currentAssets).toBe(input.currentAssets);
    expect(restored.monthlyInvestment).toBe(input.monthlyInvestment);
    expect(restored.familyType).toBe(input.familyType);
    expect(restored.currentAge).toBe(input.currentAge);
    expect(restored.fireStrategy).toBe(input.fireStrategy);
    expect(restored.yieldRate).toBe(input.yieldRate);
  });

  it("yieldストラテジーもラウンドトリップ可能", () => {
    const input: SimulationInput = {
      ...baseInput,
      fireStrategy: "yield",
      yieldRate: 0.035,
    };

    const queryString = inputToParams(input);
    const params = Object.fromEntries(new URLSearchParams(queryString));
    const restored = inputFromParams(params);

    expect(restored.fireStrategy).toBe("yield");
    expect(restored.yieldRate).toBe(0.035);
  });
});
