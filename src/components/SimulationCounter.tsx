"use client";

import { useState, useEffect } from "react";
import { getSimulationCount } from "@/lib/counter";

export default function SimulationCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getSimulationCount().then(setCount);
  }, []);

  if (count === null || count === 0) return null;

  return (
    <p className="mt-3 text-sm text-gray-500">
      累計 <span className="font-bold text-primary-600">{count.toLocaleString()}</span> 回シミュレーションされています
    </p>
  );
}
