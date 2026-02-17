"use client";

import { useState } from "react";
import { emailSequence } from "@/data/email-sequence";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // 初回ロード時にlocalStorageで送信済みか確認
  const alreadySubmitted =
    typeof window !== "undefined" &&
    localStorage.getItem("fire-sim-email-subscribed") === "true";

  if (alreadySubmitted || submitted) {
    return (
      <div className="card border-accent-200 bg-accent-50 text-center">
        <p className="font-medium text-accent-800">
          登録ありがとうございます!
        </p>
        <p className="mt-1 text-sm text-accent-700">
          5日間のFIRE入門メールをお届けします。
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("正しいメールアドレスを入力してください");
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_EMAIL_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        // サイレントフェイル（フォームサービスが未設定でもUXを壊さない）
      }
    }

    localStorage.setItem("fire-sim-email-subscribed", "true");
    setSubmitted(true);
  };

  return (
    <div className="card border-primary-200 bg-gradient-to-br from-primary-50 to-white">
      <div className="text-center">
        <p className="text-lg font-bold text-gray-800">
          【無料】5日間FIRE入門メール講座
        </p>
        <p className="mt-1 text-sm text-gray-600">
          FIREの基礎から実践まで、5日間で学べるメール講座をお届けします
        </p>
      </div>

      {/* カリキュラムプレビュー */}
      <div className="mt-4">
        <button
          type="button"
          className="mx-auto flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-500"
          onClick={() => setShowPreview(!showPreview)}
          aria-expanded={showPreview}
        >
          {showPreview ? "閉じる" : "カリキュラムを見る"}
          <svg
            className={`h-3.5 w-3.5 transition-transform ${showPreview ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {showPreview && (
          <div className="mt-3 space-y-2">
            {emailSequence.map((day) => (
              <div key={day.day} className="flex gap-3 rounded-lg bg-white/60 px-3 py-2">
                <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                  {day.day}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {day.heading}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {day.previewText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2 sm:mx-auto sm:max-w-md">
        <input
          type="email"
          className="input-field flex-1"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0 whitespace-nowrap">
          無料で登録
        </button>
      </form>
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
      <p className="mt-2 text-center text-xs text-gray-400">
        いつでも解除できます。スパムは送りません。
      </p>
    </div>
  );
}
