"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const menuSections = [
  {
    label: "ツール",
    links: [
      { href: "/simulate/", text: "シミュレーション" },
      { href: "/diagnose/", text: "FIRE診断" },
      { href: "/withdraw/", text: "取り崩しシミュレーション" },
      { href: "/tracker/", text: "進捗トラッカー" },
    ],
  },
  {
    label: "学ぶ",
    links: [
      { href: "/guide/", text: "ガイド記事一覧" },
      { href: "/recommend/", text: "おすすめ証券口座・投信" },
    ],
  },
  {
    label: "調べる",
    links: [
      { href: "/fire/", text: "地域別FIRE情報" },
      { href: "/cases/", text: "モデルケース" },
      { href: "/plan/", text: "年収×年代別プラン" },
      { href: "/faq/", text: "よくある質問" },
    ],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, handleEscape]);

  return (
    <header className="border-b border-gray-200 bg-white" role="banner">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="shrink-0 text-base font-bold text-primary-700 sm:text-xl"
        >
          FIREシミュレーター
        </Link>

        {/* PC nav */}
        <nav
          aria-label="メインナビゲーション"
          className="hidden gap-3 text-sm sm:flex"
        >
          <Link href="/simulate/" className="text-gray-600 transition-colors hover:text-primary-600">シミュレーション</Link>
          <Link href="/diagnose/" className="text-gray-600 transition-colors hover:text-primary-600">診断</Link>
          <Link href="/withdraw/" className="text-gray-600 transition-colors hover:text-primary-600">取り崩し</Link>
          <Link href="/tracker/" className="text-gray-600 transition-colors hover:text-primary-600">トラッカー</Link>
          <Link href="/guide/" className="text-gray-600 transition-colors hover:text-primary-600">ガイド</Link>
          <Link href="/recommend/" className="text-gray-600 transition-colors hover:text-primary-600">おすすめ</Link>
          <Link href="/fire/" className="text-gray-600 transition-colors hover:text-primary-600">地域別</Link>
          <Link href="/cases/" className="text-gray-600 transition-colors hover:text-primary-600">事例</Link>
          <Link href="/plan/" className="text-gray-600 transition-colors hover:text-primary-600">プラン</Link>
          <Link href="/faq/" className="text-gray-600 transition-colors hover:text-primary-600">FAQ</Link>
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Menu panel */}
          <nav
            aria-label="モバイルメニュー"
            className="fixed inset-x-0 top-0 z-50 max-h-[85vh] overflow-y-auto bg-white shadow-lg sm:hidden animate-slide-down"
          >
            {/* Close bar */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <span className="text-base font-bold text-primary-700">メニュー</span>
              <button
                type="button"
                aria-label="メニューを閉じる"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-100"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-4 space-y-5">
              {menuSections.map((section) => (
                <div key={section.label}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {section.label}
                  </p>
                  <ul className="space-y-1">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
