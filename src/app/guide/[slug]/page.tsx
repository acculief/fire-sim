import { Metadata } from "next";
import Link from "next/link";
import { guides, getGuideBySlug } from "@/data/guides";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";
import { autoLinkKeywords } from "@/lib/auto-link";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);
  if (!article) return { title: "記事が見つかりません" };

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);
  if (!article) return <div>記事が見つかりません</div>;

  const relatedArticles = article.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter(Boolean);

  // 記事全体で各キーワード1回のみリンク化するためのSet
  const linkedKeywords = new Set<string>();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: "ja",
    author: {
      "@type": "Organization",
      name: "FIREシミュレーター",
      url: "https://fire-sim-phi.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "FIREシミュレーター",
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド", href: "/guide/" },
          { label: article.title },
        ]}
      />

      <article>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {article.title}
        </h1>
        <p className="mt-3 text-gray-600">{article.description}</p>
        <time
          dateTime={article.publishedAt}
          className="mt-2 block text-sm text-gray-400"
        >
          {article.publishedAt}
        </time>

        {/* 目次 */}
        <nav className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-bold text-gray-700">目次</p>
          <ol className="list-inside list-decimal space-y-1 text-sm text-primary-700">
            {article.sections.map((section, i) => (
              <li key={i}>
                <a
                  href={`#section-${i}`}
                  className="hover:text-primary-500 hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 本文セクション */}
        <div className="mt-8 space-y-10">
          {article.sections.map((section, i) => (
            <section key={i} id={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-800">
                {section.heading}
              </h2>
              <div className="mt-3 max-w-none text-gray-700">
                {section.body.split("\n\n").map((paragraph, j) => {
                  const trimmed = paragraph.trim();

                  // Markdown table detection
                  if (trimmed.startsWith("|") && trimmed.includes("\n")) {
                    const rows = trimmed.split("\n").filter((r) => r.trim());
                    const isSeparator = (r: string) => /^\|[\s\-:|]+\|$/.test(r.trim());
                    const parseRow = (r: string) =>
                      r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

                    const headerRow = parseRow(rows[0]);
                    const dataRows = rows.filter((r, idx) => idx > 0 && !isSeparator(r)).map(parseRow);

                    const tableHtml = `<div class="overflow-x-auto mb-3"><table class="min-w-full border-collapse text-sm"><thead><tr>${headerRow
                      .map(
                        (c) =>
                          `<th class="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700">${c.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</th>`,
                      )
                      .join("")}</tr></thead><tbody>${dataRows
                      .map(
                        (row) =>
                          `<tr>${row
                            .map(
                              (c) =>
                                `<td class="border border-gray-200 px-3 py-2">${c.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</td>`,
                            )
                            .join("")}</tr>`,
                      )
                      .join("")}</tbody></table></div>`;

                    return (
                      <div
                        key={j}
                        dangerouslySetInnerHTML={{ __html: tableHtml }}
                      />
                    );
                  }

                  let html = paragraph
                    .replace(/\n/g, "<br />")
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
                  html = autoLinkKeywords(html, slug, linkedKeywords);
                  return (
                    <p
                      key={j}
                      className="mb-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </article>

      {/* CTA */}
      <div className="mt-12 rounded-lg border-2 border-primary-200 bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-800">
          あなたのFIRE達成年を計算してみませんか？
        </p>
        <p className="mt-1 text-sm text-primary-700">
          地域・年収・家族構成から、必要資産と達成年をシミュレーション
        </p>
        <Link
          href="/simulate/"
          className="btn-primary mt-4 inline-block text-lg"
        >
          無料でシミュレーション開始
        </Link>
      </div>

      {/* おすすめツール */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-gray-800">
          FIRE達成に役立つツール
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          証券口座・投資信託・書籍を厳選して紹介しています
        </p>
        <Link
          href="/recommend/"
          className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline"
        >
          おすすめツール・書籍を見る →
        </Link>
      </div>

      {/* 関連記事 */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-800">関連記事</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedArticles.map((related) => (
              <Link
                key={related!.slug}
                href={`/guide/${related!.slug}/`}
                className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                <p className="font-bold text-gray-800">{related!.title}</p>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {related!.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
