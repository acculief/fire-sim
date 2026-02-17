export interface LongtailPage {
  slug: string;
  title: string;
  ageLabel: string;
  age: number;
  annualIncome: number;
  description: string;
}

const AGE_GROUPS = [
  { label: "20代", age: 27, slug: "20s" },
  { label: "30代", age: 35, slug: "30s" },
  { label: "40代", age: 45, slug: "40s" },
  { label: "50代", age: 55, slug: "50s" },
] as const;

const INCOMES = [300, 400, 500, 600, 700, 800, 1000] as const;

function buildDescription(ageLabel: string, income: number): string {
  return `${ageLabel}・年収${income}万円の方がFIREを達成するために必要な資産額・達成年齢を、家族構成別・地域別にシミュレーション。独身・夫婦・子あり家庭それぞれのFIREプランを解説します。`;
}

export const longtailPages: LongtailPage[] = AGE_GROUPS.flatMap((ag) =>
  INCOMES.map((income) => ({
    slug: `${ag.slug}-${income}`,
    title: `${ag.label}・年収${income}万円のFIREプラン`,
    ageLabel: ag.label,
    age: ag.age,
    annualIncome: income,
    description: buildDescription(ag.label, income),
  })),
);

export function getLongtailPageBySlug(
  slug: string,
): LongtailPage | undefined {
  return longtailPages.find((p) => p.slug === slug);
}
