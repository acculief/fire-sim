"use client";

import SegmentError from "@/components/SegmentError";

export default function PlanError({ reset }: { error: Error; reset: () => void }) {
  return <SegmentError reset={reset} backHref="/plan/" backLabel="プラン一覧へ" />;
}
