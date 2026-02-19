import Link from "next/link";
import { getGuideBySlug } from "@/data/guides";

/** 関連ガイド記事のスラッグを、ページの種類ごとに定義 */
const GUIDE_SLUGS_BY_CATEGORY: Record<string, string[]> = {
  family: ["fire-with-family", "fire-couple-strategy", "fire-savings-rate", "how-to-calculate-fire-number"],
  income: ["fire-savings-rate", "how-to-calculate-fire-number", "fire-first-steps", "fire-mistakes"],
  housing: ["fire-real-estate", "fire-by-region", "fire-savings-rate", "withdrawal-vs-yield"],
  age: ["fire-first-steps", "fire-index-investing", "nisa-fire-acceleration", "fire-mistakes"],
  region: ["fire-by-region", "how-to-calculate-fire-number", "fire-real-estate", "fire-savings-rate"],
};

export default function RelatedGuides({ category }: { category: string }) {
  const slugs = GUIDE_SLUGS_BY_CATEGORY[category] ?? GUIDE_SLUGS_BY_CATEGORY.income;
  const articles = slugs
    .map((s) => getGuideBySlug(s))
    .filter((a): a is NonNullable<typeof a> => a != null);

  if (articles.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-gray-900">
        関連ガイド記事
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/guide/${article.slug}/`}
            className="block rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="text-sm font-bold text-gray-800">{article.title}</p>
            <p className="mt-1 text-xs text-gray-600 line-clamp-2">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-3 text-center">
        <Link
          href="/guide/"
          className="text-sm text-primary-600 hover:text-primary-500 hover:underline"
        >
          すべてのガイド記事を見る →
        </Link>
      </div>
    </section>
  );
}
