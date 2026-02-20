"use client";

import SegmentError from "@/components/SegmentError";

export default function FireError({ reset }: { error: Error; reset: () => void }) {
  return <SegmentError reset={reset} backHref="/fire/" backLabel="地域一覧へ" />;
}
