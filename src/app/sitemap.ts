import { MetadataRoute } from "next";
import { prefectures } from "@/data/prefectures";
import { INCOME_LEVELS, FAMILY_TYPES_FOR_SEO, AGE_GROUPS_FOR_SEO, HOUSING_TYPES_FOR_SEO, REGION_SLUGS } from "@/config/assumptions";
import { guides } from "@/data/guides";
import { modelCases } from "@/data/model-cases";
import { longtailPages } from "@/data/longtail-pages";
import { INCOME_LEVELS as TAKE_HOME_LEVELS } from "@/lib/income-tax";
import { SITE_URL } from "@/config/site";

const BASE_URL = SITE_URL;

// ─────────────────────────────────────────────────────
// 単一サイトマップ。Googleは先頭から順にクロールするため
// 重要度の高いページを先に、詳細パラメータページを最後に配置
// ─────────────────────────────────────────────────────
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── Tier 1: コアページ（最優先）──────────────────────
  const corePages = [
    { url: `${BASE_URL}/`, priority: 1.0 },
    { url: `${BASE_URL}/simulate/`, priority: 0.9 },
    { url: `${BASE_URL}/diagnose/`, priority: 0.9 },
    { url: `${BASE_URL}/diagnose/type/`, priority: 0.9 },
    { url: `${BASE_URL}/withdraw/`, priority: 0.8 },
    { url: `${BASE_URL}/compound/`, priority: 0.8 },
    { url: `${BASE_URL}/guide/`, priority: 0.8 },
    { url: `${BASE_URL}/recommend/`, priority: 0.8 },
    { url: `${BASE_URL}/fire/`, priority: 0.8 },
    { url: `${BASE_URL}/cases/`, priority: 0.8 },
    { url: `${BASE_URL}/plan/`, priority: 0.8 },
    { url: `${BASE_URL}/income/`, priority: 0.8 },
    { url: `${BASE_URL}/tracker/`, priority: 0.7 },
    { url: `${BASE_URL}/faq/`, priority: 0.7 },
  ];

  for (const p of corePages) {
    entries.push({
      url: p.url,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: p.priority,
    });
  }

  // ── Tier 2: ガイド記事 ────────────────────────────────
  for (const article of guides) {
    entries.push({
      url: `${BASE_URL}/guide/${article.slug}/`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // ── Tier 3: 都道府県トップ47 ──────────────────────────
  for (const pref of prefectures) {
    entries.push({
      url: `${BASE_URL}/fire/${pref.code}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // ── Tier 4: 地方別・モデルケース・プラン・手取り ─────────
  for (const region of REGION_SLUGS) {
    entries.push({
      url: `${BASE_URL}/fire/region/${region.slug}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  for (const c of modelCases) {
    entries.push({
      url: `${BASE_URL}/cases/${c.slug}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const p of longtailPages) {
    entries.push({
      url: `${BASE_URL}/plan/${p.slug}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  for (const level of TAKE_HOME_LEVELS) {
    entries.push({
      url: `${BASE_URL}/income/${level}/`,
      lastModified: new Date("2026-02-26"),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // ── Tier 5: 都道府県×パラメータ ~940件（最後尾・低優先度）──
  for (const pref of prefectures) {
    for (const income of INCOME_LEVELS) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/income/${income.value}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
    for (const family of FAMILY_TYPES_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/family/${family.key}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
    for (const age of AGE_GROUPS_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/age/${age.slug}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
    for (const housing of HOUSING_TYPES_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/housing/${housing.key}/`,
        lastModified: new Date("2026-02-26"),
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
  }

  return entries;
}
