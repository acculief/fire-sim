import { MetadataRoute } from "next";
import { prefectures } from "@/data/prefectures";
import { INCOME_LEVELS, FAMILY_TYPES_FOR_SEO, AGE_GROUPS_FOR_SEO, HOUSING_TYPES_FOR_SEO, REGION_SLUGS } from "@/config/assumptions";
import { guides } from "@/data/guides";
import { modelCases } from "@/data/model-cases";
import { longtailPages } from "@/data/longtail-pages";

const BASE_URL = "https://fire-sim-phi.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // トップページ
  entries.push({
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  // シミュレーションページ
  entries.push({
    url: `${BASE_URL}/simulate/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  });

  // ガイド一覧
  entries.push({
    url: `${BASE_URL}/guide/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  // おすすめページ
  entries.push({
    url: `${BASE_URL}/recommend/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  });

  // FIRE達成度診断ページ
  entries.push({
    url: `${BASE_URL}/diagnose/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  });

  // FAQ
  entries.push({
    url: `${BASE_URL}/faq/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  });

  // FIRE進捗トラッカー
  entries.push({
    url: `${BASE_URL}/tracker/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  });

  // 取り崩しシミュレーション
  entries.push({
    url: `${BASE_URL}/withdraw/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  });

  // 地域別一覧ページ
  entries.push({
    url: `${BASE_URL}/fire/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  // ガイド記事
  for (const article of guides) {
    entries.push({
      url: `${BASE_URL}/guide/${article.slug}/`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // 都道府県ページ
  for (const pref of prefectures) {
    entries.push({
      url: `${BASE_URL}/fire/${pref.code}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // 年収別ページ
    for (const income of INCOME_LEVELS) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/income/${income.value}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // 家族構成別ページ
    for (const family of FAMILY_TYPES_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/family/${family.key}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // 年代別ページ
    for (const age of AGE_GROUPS_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/age/${age.slug}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // 住宅タイプ別ページ
    for (const housing of HOUSING_TYPES_FOR_SEO) {
      entries.push({
        url: `${BASE_URL}/fire/${pref.code}/housing/${housing.key}/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // 地方別比較ページ
  for (const region of REGION_SLUGS) {
    entries.push({
      url: `${BASE_URL}/fire/region/${region.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // モデルケース一覧
  entries.push({
    url: `${BASE_URL}/cases/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  });

  // モデルケース個別ページ
  for (const c of modelCases) {
    entries.push({
      url: `${BASE_URL}/cases/${c.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // プラン一覧ページ
  entries.push({
    url: `${BASE_URL}/plan/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  });

  // 年収×年代別プラン個別ページ
  for (const p of longtailPages) {
    entries.push({
      url: `${BASE_URL}/plan/${p.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
