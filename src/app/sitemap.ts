import { MetadataRoute } from "next";
import { prefectures } from "@/data/prefectures";
import { INCOME_LEVELS, FAMILY_TYPES_FOR_SEO, AGE_GROUPS_FOR_SEO, HOUSING_TYPES_FOR_SEO, REGION_SLUGS } from "@/config/assumptions";
import { guides } from "@/data/guides";
import { modelCases } from "@/data/model-cases";
import { longtailPages } from "@/data/longtail-pages";
import { INCOME_LEVELS as TAKE_HOME_LEVELS } from "@/lib/income-tax";
import { SITE_URL } from "@/config/site";

const BASE_URL = SITE_URL;

// 2つのサイトマップに分割
// /sitemap/0.xml → 重要ページ（~120件）→ Googleが優先的に処理
// /sitemap/1.xml → 詳細パラメータページ（~940件）→ 後回しOK
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }];
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  if (id === 0) {
    return mainSitemap();
  }
  return detailSitemap();
}

/** 重要ページ: トップ・ツール・ガイド・都道府県47・地方別・モデルケース・プラン・手取り */
function mainSitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── コアページ ──
  const corePages = [
    { url: `${BASE_URL}/`, priority: 1.0, freq: "weekly" },
    { url: `${BASE_URL}/simulate/`, priority: 0.9, freq: "monthly" },
    { url: `${BASE_URL}/diagnose/`, priority: 0.9, freq: "monthly" },
    { url: `${BASE_URL}/diagnose/type/`, priority: 0.9, freq: "monthly" },
    { url: `${BASE_URL}/withdraw/`, priority: 0.8, freq: "monthly" },
    { url: `${BASE_URL}/compound/`, priority: 0.8, freq: "monthly" },
    { url: `${BASE_URL}/guide/`, priority: 0.8, freq: "weekly" },
    { url: `${BASE_URL}/recommend/`, priority: 0.8, freq: "monthly" },
    { url: `${BASE_URL}/fire/`, priority: 0.8, freq: "weekly" },
    { url: `${BASE_URL}/cases/`, priority: 0.8, freq: "monthly" },
    { url: `${BASE_URL}/plan/`, priority: 0.8, freq: "weekly" },
    { url: `${BASE_URL}/income/`, priority: 0.8, freq: "monthly" },
    { url: `${BASE_URL}/faq/`, priority: 0.7, freq: "monthly" },
    { url: `${BASE_URL}/tracker/`, priority: 0.7, freq: "monthly" },
  ] as const;

  for (const p of corePages) {
    entries.push({
      url: p.url,
      lastModified: new Date("2026-02-26"),
      changeFrequency: p.freq as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: p.priority,
    });
  }

  // ── ガイド記事 ──
  for (const article of guides) {
    entries.push({
      url: `${BASE_URL}/guide/${article.slug}/`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // ── 都道府県トップ47（重要・Googleが最優先でクロールすべき） ──
  for (const pref of prefectures) {
    entries.push({
      url: `${BASE_URL}/fire/${pref.code}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // ── 地方別比較8ページ ──
  for (const region of REGION_SLUGS) {
    entries.push({
      url: `${BASE_URL}/fire/region/${region.slug}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // ── モデルケース ──
  for (const c of modelCases) {
    entries.push({
      url: `${BASE_URL}/cases/${c.slug}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // ── 年収×年代別プラン ──
  for (const p of longtailPages) {
    entries.push({
      url: `${BASE_URL}/plan/${p.slug}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // ── 手取り早見表 ──
  for (const level of TAKE_HOME_LEVELS) {
    entries.push({
      url: `${BASE_URL}/income/${level}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}

/** 詳細パラメータページ: 都道府県×(年収/家族/年代/住宅) = ~940件 */
function detailSitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const pref of prefectures) {
    for (const income of INCOME_LEVELS) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/income/${income.value}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
    for (const family of FAMILY_TYPES_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/family/${family.key}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
    for (const age of AGE_GROUPS_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/age/${age.slug}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
    for (const housing of HOUSING_TYPES_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/housing/${housing.key}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
