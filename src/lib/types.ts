export type FireStrategy = "withdrawal" | "yield";

export interface SimulationInput {
  prefecture: string;
  annualIncome: number;
  incomeType: "gross" | "net";
  currentAssets: number;
  monthlyInvestment: number;
  familyType: string;
  housingType: string;
  currentAge: number;
  targetAge?: number;
  annualReturnRate: number;
  swr: number;
  inflationRate: number;
  fireStrategy: FireStrategy;
  yieldRate: number;
  customMonthlyExpense?: number;
  dividendTaxRate: number;
  postFireMonthlyCost?: number;
}

export interface ScenarioResult {
  label: string;
  color: string;
  fireNumber: number;
  monthlyExpense: number;
  annualExpense: number;
  achievementAge: number | null;
  achievementYears: number | null;
  yearlyProjection: YearProjection[];
}

export interface YearProjection {
  age: number;
  year: number;
  assets: number;
  fireNumber: number;
  annualInvestment: number;
}

export interface SimulationResult {
  input: SimulationInput;
  prefectureName: string;
  costIndex: number;
  familyLabel: string;
  housingLabel: string;
  strategyLabel: string;
  baseMonthlyExpense: number;
  postFireMonthlyCost: number;
  effectiveYieldRate: number | null;
  scenarios: {
    optimistic: ScenarioResult;
    neutral: ScenarioResult;
    pessimistic: ScenarioResult;
  };
  sensitivity: SensitivityItem[];
}

export interface SensitivityItem {
  label: string;
  description: string;
  currentYears: number | null;
  newYears: number | null;
  diff: number | null;
}
