"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { SimulationResult } from "@/lib/types";

interface Props {
  scenarios: SimulationResult["scenarios"];
}

export default function AssetChart({ scenarios }: Props) {
  const neutral = scenarios.neutral;
  const maxYears = Math.min(
    50,
    Math.max(
      scenarios.optimistic.yearlyProjection.length,
      scenarios.neutral.yearlyProjection.length,
      scenarios.pessimistic.yearlyProjection.length,
    ),
  );

  const data = [];
  for (let i = 0; i < maxYears; i++) {
    const opt = scenarios.optimistic.yearlyProjection[i];
    const neu = scenarios.neutral.yearlyProjection[i];
    const pes = scenarios.pessimistic.yearlyProjection[i];
    if (!neu) break;
    data.push({
      age: neu.age,
      楽観: opt?.assets ?? null,
      中立: neu.assets,
      悲観: pes?.assets ?? null,
      必要資産: neu.fireNumber,
    });
  }

  const formatYAxisValue = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(1)}億`;
    return `${value}万`;
  };

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="age"
            fontSize={12}
            tickFormatter={(v) => `${v}歳`}
          />
          <YAxis fontSize={12} tickFormatter={formatYAxisValue} width={60} />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${Math.round(value).toLocaleString()}万円`,
              name,
            ]}
            labelFormatter={(label) => `${label}歳`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="楽観"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="中立"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="悲観"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="必要資産"
            stroke="#9ca3af"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
