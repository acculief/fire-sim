"use client";

import type { HistoryItem } from "@/lib/history";
import { formatMoney } from "@/lib/format";

interface Props {
  current: {
    prefectureName: string;
    strategyLabel: string;
    fireNumber: number;
    achievementAge: number | null;
    monthlyExpense: number;
  };
  compare: HistoryItem;
  onClose: () => void;
}

export default function ComparePanel({ current, compare, onClose }: Props) {
  const rows = [
    {
      label: "条件",
      a: `${current.prefectureName}・${current.strategyLabel}`,
      b: `${compare.summary.prefectureName}・${compare.summary.strategyLabel}`,
    },
    {
      label: "必要資産",
      a: formatMoney(current.fireNumber),
      b: formatMoney(compare.summary.fireNumber),
      diffValue: current.fireNumber - compare.summary.fireNumber,
    },
    {
      label: "達成年齢",
      a: current.achievementAge !== null ? `${current.achievementAge}歳` : "ー",
      b:
        compare.summary.achievementAge !== null
          ? `${compare.summary.achievementAge}歳`
          : "ー",
      diffValue:
        current.achievementAge !== null &&
        compare.summary.achievementAge !== null
          ? current.achievementAge - compare.summary.achievementAge
          : null,
    },
    {
      label: "月間支出",
      a: `${current.monthlyExpense}万円`,
      b: `${compare.summary.monthlyExpense}万円`,
    },
  ];

  return (
    <div className="card border-primary-200 bg-primary-50">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary-800">結果比較</h3>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="比較パネルを閉じる"
        >
          閉じる ×
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary-200">
              <th className="pb-2 text-left font-medium text-gray-500"></th>
              <th className="pb-2 text-right font-medium text-primary-700">
                今回
              </th>
              <th className="pb-2 text-right font-medium text-gray-600">
                比較対象
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="py-2 text-gray-600">{row.label}</td>
                <td className="py-2 text-right font-medium">{row.a}</td>
                <td className="py-2 text-right text-gray-600">{row.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
