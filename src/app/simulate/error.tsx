"use client";

import SegmentError from "@/components/SegmentError";

export default function SimulateError({ reset }: { error: Error; reset: () => void }) {
  return <SegmentError reset={reset} backLabel="トップページへ" />;
}
