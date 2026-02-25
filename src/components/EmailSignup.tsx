"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "登録完了！");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "エラーが発生しました");
      }
    } catch {
      setStatus("error");
      setMessage("通信エラーが発生しました");
    }
  };

  return (
    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
      <div className="mb-2 text-2xl">📊</div>
      <h3 className="text-lg font-bold text-gray-900">
        月次「FIRE進捗レポート」を受け取る
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        毎月1回、積立ペースの診断・NISA枠の使い切りチェック・
        相場コメントをメールでお届けします。完全無料。
      </p>
      {status === "success" ? (
        <div className="mt-4 rounded-lg bg-green-100 p-4">
          <p className="font-bold text-green-800">✅ {message}</p>
          <p className="mt-1 text-sm text-green-700">
            来月の配信をお楽しみに！
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="email-signup" className="sr-only">
            メールアドレス
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <input
              id="email-signup"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-invalid={status === "error" ? true : undefined}
              aria-describedby={status === "error" ? "email-signup-error" : "email-signup-hint"}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none sm:w-64"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-green-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
            >
              {status === "loading" ? "送信中..." : "無料で登録"}
            </button>
          </div>
          {status === "error" && (
            <p id="email-signup-error" className="mt-2 text-sm text-red-600" role="alert">{message}</p>
          )}
          <p id="email-signup-hint" className="mt-2 text-xs text-gray-600">
            登録解除はいつでも可能。スパムは送りません。
          </p>
        </form>
      )}
    </div>
  );
}
