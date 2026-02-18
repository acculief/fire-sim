"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        エラーが発生しました
      </h1>
      <p className="mt-3 text-gray-600">
        申し訳ありません。ページの表示中にエラーが発生しました。
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={() => reset()}
        >
          もう一度試す
        </button>
        <a href="/" className="btn-secondary inline-block">
          トップページへ
        </a>
      </div>
    </div>
  );
}
