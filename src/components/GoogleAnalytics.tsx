"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** SPA遷移時にpage_viewイベントを送信するトラッカー */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag) return;
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag("event", "page_view", { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

/**
 * クライアントサイド遷移のページビュー送信のみ担当。
 * gtag.jsの読み込みとconfigはlayout.tsx（Server Component）側の
 * <Script> で行う。
 */
export default function GoogleAnalyticsPageview() {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
