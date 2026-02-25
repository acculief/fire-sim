"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UnsubscribeForm() {
  const params = useSearchParams();
  const emailFromUrl = params.get("email") || "";
  const [email, setEmail] = useState(emailFromUrl);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [emailFromUrl]);

  const handleUnsubscribe = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900">配信停止</h1>
      {status === "done" ? (
        <p className="mt-6 text-green-700">配信を停止しました。またいつでも登録できます。</p>
      ) : (
        <>
          <p className="mt-4 text-gray-600">以下のメールアドレスの配信を停止します。</p>
          <label htmlFor="unsubscribe-email" className="sr-only">
            メールアドレス
          </label>
          <input
            id="unsubscribe-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            aria-invalid={status === "error" ? true : undefined}
            aria-describedby={status === "error" ? "unsubscribe-error" : undefined}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-center focus:border-primary-500 focus:outline-none"
          />
          <button
            onClick={handleUnsubscribe}
            disabled={status === "loading" || !email}
            className="mt-4 rounded-lg bg-red-600 px-8 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {status === "loading" ? "処理中..." : "配信停止する"}
          </button>
          {status === "error" && (
            <p id="unsubscribe-error" className="mt-2 text-red-600" role="alert">
              エラーが発生しました。もう一度お試しください。
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-20 text-center"><p className="text-gray-600">読み込み中...</p></div>}>
      <UnsubscribeForm />
    </Suspense>
  );
}
