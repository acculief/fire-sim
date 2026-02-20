"use client";

import Link from "next/link";

interface Props {
  title?: string;
  reset: () => void;
  backHref?: string;
  backLabel?: string;
}

export default function SegmentError({
  title = "エラーが発生しました",
  reset,
  backHref = "/",
  backLabel = "トップページへ",
}: Props) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-3 text-gray-600">
        申し訳ありません。ページの表示中にエラーが発生しました。
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" className="btn-primary" onClick={() => reset()}>
          もう一度試す
        </button>
        <Link href={backHref} className="btn-secondary">
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
