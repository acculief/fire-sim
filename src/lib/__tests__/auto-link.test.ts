import { describe, it, expect } from "vitest";
import { autoLinkKeywords } from "../auto-link";

describe("autoLinkKeywords", () => {
  it("キーワードをリンクに変換する", () => {
    const linked = new Set<string>();
    const result = autoLinkKeywords("4%ルールは重要です", "what-is-fire", linked);
    expect(result).toContain('href="/guide/4percent-rule/"');
    expect(result).toContain("4%ルール");
    expect(linked.has("4%ルール")).toBe(true);
  });

  it("自分自身の記事へのリンクは生成しない", () => {
    const linked = new Set<string>();
    const result = autoLinkKeywords("4%ルールは重要です", "4percent-rule", linked);
    expect(result).not.toContain("href=");
    expect(result).toBe("4%ルールは重要です");
  });

  it("同じキーワードは1回のみリンク化", () => {
    const linked = new Set<string>();
    const result1 = autoLinkKeywords("4%ルールの説明", "what-is-fire", linked);
    const result2 = autoLinkKeywords("4%ルールの続き", "what-is-fire", linked);

    expect(result1).toContain("href=");
    expect(result2).not.toContain("href=");
  });

  it("複数のキーワードを同時にリンク化できる", () => {
    const linked = new Set<string>();
    const result = autoLinkKeywords(
      "新NISAとインデックス投資について",
      "what-is-fire",
      linked,
    );
    expect(result).toContain('href="/guide/nisa-ideco-for-fire/"');
    expect(result).toContain('href="/guide/fire-index-investing/"');
  });

  it("キーワードがない場合は変更しない", () => {
    const linked = new Set<string>();
    const input = "特にキーワードのないテキスト";
    const result = autoLinkKeywords(input, "what-is-fire", linked);
    expect(result).toBe(input);
  });
});
