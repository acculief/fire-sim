/**
 * ガイド記事本文中のキーワードを内部リンクに自動変換する
 * 各キーワードは記事全体で最初の1回のみリンク化（過剰リンク防止）
 */

const KEYWORD_LINKS: { keyword: string; href: string }[] = [
  { keyword: "4%ルール", href: "/guide/4percent-rule/" },
  { keyword: "SWR", href: "/guide/4percent-rule/" },
  { keyword: "トリニティ・スタディ", href: "/guide/4percent-rule/" },
  { keyword: "インデックス投資", href: "/guide/fire-index-investing/" },
  { keyword: "インデックスファンド", href: "/guide/fire-index-investing/" },
  { keyword: "新NISA", href: "/guide/nisa-ideco-for-fire/" },
  { keyword: "iDeCo", href: "/guide/nisa-ideco-for-fire/" },
  { keyword: "貯蓄率", href: "/guide/fire-savings-rate/" },
  { keyword: "節税", href: "/guide/fire-tax-optimization/" },
  { keyword: "配当", href: "/guide/withdrawal-vs-yield/" },
  { keyword: "取り崩し", href: "/guide/withdrawal-vs-yield/" },
  { keyword: "サイドFIRE", href: "/guide/side-fire/" },
  { keyword: "バリスタFIRE", href: "/guide/side-fire/" },
  { keyword: "生活防衛資金", href: "/guide/fire-emergency-fund/" },
  { keyword: "シミュレーション", href: "/simulate/" },
  { keyword: "シミュレーター", href: "/simulate/" },
  { keyword: "証券口座", href: "/recommend/#brokers" },
];

/**
 * HTML文字列中のキーワードをリンクに変換する
 * @param html 変換対象のHTML文字列
 * @param currentSlug 現在の記事のslug（自分自身へのリンクを避けるため）
 * @param linkedKeywords すでにリンク済みのキーワードセット（記事全体で1回のみ制限）
 */
export function autoLinkKeywords(
  html: string,
  currentSlug: string,
  linkedKeywords: Set<string>,
): string {
  let result = html;

  for (const { keyword, href } of KEYWORD_LINKS) {
    // 自分自身の記事へのリンクは生成しない
    if (href.includes(currentSlug)) continue;

    // すでにこのキーワードがリンク済みならスキップ
    if (linkedKeywords.has(keyword)) continue;

    // <strong>や<a>タグ内のキーワードはスキップするため、タグ外のみ対象
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<!<[^>]*)(?<![\\w/])${escaped}(?![\\w])`, "");

    if (regex.test(result)) {
      result = result.replace(
        regex,
        `<a href="${href}" class="text-primary-600 underline decoration-primary-300 hover:text-primary-500">${keyword}</a>`,
      );
      linkedKeywords.add(keyword);
    }
  }

  return result;
}
