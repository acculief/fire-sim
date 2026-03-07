import { Metadata } from "next";
import Link from "next/link";
import { guides, getGuideBySlug } from "@/data/guides";
import { SITE_URL } from "@/config/site";
import Disclaimer from "@/components/Disclaimer";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import GuideImage from "@/components/GuideImage";
import { autoLinkKeywords } from "@/lib/auto-link";
import BrokerCtaSection from "@/components/BrokerCtaSection";

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

  const ogImages = article.heroImage
    ? [
        {
          url: article.heroImage.src,
          width: article.heroImage.width,
          height: article.heroImage.height,
          alt: article.heroImage.alt,
        },
      ]
    : undefined;

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/guide/${slug}/` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `/guide/${slug}/`,
      siteName: "FIREシミュレーター",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      ...(ogImages && { images: ogImages }),
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
    .filter((a): a is NonNullable<typeof a> => a != null);

  // 記事全体で各キーワード1回のみリンク化するためのSet
  const linkedKeywords = new Set<string>();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/guide/${slug}/` },
    url: `${SITE_URL}/guide/${slug}/`,
    image: article.heroImage
      ? `${SITE_URL}${article.heroImage.src}`
      : `${SITE_URL}/opengraph-image`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: "ja",
    author: {
      "@type": "Person",
      name: "山本 健太",
      url: `${SITE_URL}/about/author/`,
    },
    publisher: {
      "@type": "Organization",
      name: "FIREシミュレーター",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
  };


  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "ガイド", item: `${SITE_URL}/guide/` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/guide/${slug}/` },
    ],
  };

  const faqSchema = article.faqs && article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  } : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbData} />
      {faqSchema && <JsonLd data={faqSchema} />}

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
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <time dateTime={article.updatedAt ?? article.publishedAt}>
            更新: {article.updatedAt ?? article.publishedAt}
          </time>
          <span>｜</span>
          <Link
            href="/about/author/"
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <span className="text-base">🏔️</span>
            <span>監修: 山本 健太（FIRE研究家）</span>
          </Link>
        </div>

        {article.heroImage && (
          <GuideImage image={article.heroImage} priority />
        )}

        {/* この記事の要点（TL;DR / GEO対策） */}
        <div className="mt-6 rounded-lg border-l-4 border-primary-500 bg-primary-50 p-4">
          <p className="text-xs font-bold text-primary-700 mb-2 uppercase tracking-wide">📌 この記事の要点</p>
          <ul className="space-y-1">
            {article.sections.slice(0, 4).map((section) => (
              <li key={section.heading} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-primary-500 shrink-0 mt-0.5">✓</span>
                <span>{section.heading}</span>
              </li>
            ))}
          </ul>
          {article.faqs && article.faqs.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              よくある質問は記事末尾の「よくある質問」セクションで解説しています。
            </p>
          )}
        </div>

        {/* 目次 */}
        <nav className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-bold text-gray-700">目次</p>
          <ol className="list-inside list-decimal space-y-1 text-sm text-primary-700">
            {article.sections.map((section, i) => (
              <li key={section.heading}>
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
            <section key={section.heading} id={`section-${i}`}>
              <h2 className="text-xl font-bold text-gray-800">
                {section.heading}
              </h2>
              {section.image && <GuideImage image={section.image} />}
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

                  // H3 heading
                  if (trimmed.startsWith("### ")) {
                    const headingHtml = trimmed.slice(4)
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>');
                    return <h3 key={j} className="text-base font-bold text-gray-800 mt-5 mb-2" dangerouslySetInnerHTML={{ __html: headingHtml }} />;
                  }

                  // H2 heading inside body
                  if (trimmed.startsWith("## ")) {
                    const headingHtml = trimmed.slice(3)
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>');
                    return <h3 key={j} className="text-lg font-bold text-gray-800 mt-6 mb-2" dangerouslySetInnerHTML={{ __html: headingHtml }} />;
                  }

                  // Callout boxes: :::note / :::warn / :::point / :::check
                  if (trimmed.startsWith(":::")) {
                    const firstLine = trimmed.split("\n")[0];
                    const rest = trimmed.split("\n").slice(1).join("\n").trim();
                    const type = firstLine.replace(":::", "").trim();
                    const configs: Record<string, { bg: string; border: string; icon: string; label: string }> = {
                      note:  { bg: "bg-blue-50",   border: "border-blue-400",  icon: "💡", label: "ポイント" },
                      warn:  { bg: "bg-amber-50",  border: "border-amber-400", icon: "⚠️", label: "注意" },
                      check: { bg: "bg-green-50",  border: "border-green-400", icon: "✅", label: "まとめ" },
                      data:  { bg: "bg-gray-50",   border: "border-gray-400",  icon: "📊", label: "データ・根拠" },
                      case:  { bg: "bg-purple-50", border: "border-purple-400",icon: "👤", label: "ケーススタディ" },
                    };
                    const cfg = configs[type] || configs.note;
                    const bodyHtml = rest
                      .replace(/\n/g, "<br />")
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>');
                    return (
                      <div key={j} className={`my-4 rounded-lg border-l-4 ${cfg.border} ${cfg.bg} p-4`}>
                        <p className="text-xs font-bold text-gray-600 mb-1">{cfg.icon} {cfg.label}</p>
                        <div className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                      </div>
                    );
                  }

                  // Bullet list
                  const listLines = trimmed.split("\n");
                  if (listLines.some(l => l.trim().startsWith("- "))) {
                    const listHtml = `<ul class="list-disc pl-6 mb-3 space-y-1 text-gray-700">${listLines
                      .filter(l => l.trim().startsWith("- "))
                      .map(l => {
                        const item = l.trim().slice(2)
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>');
                        return `<li>${item}</li>`;
                      }).join("")}</ul>`;
                    return <div key={j} dangerouslySetInnerHTML={{ __html: listHtml }} />;
                  }

                  // Numbered list
                  if (listLines.some(l => /^\d+\.\s/.test(l.trim()))) {
                    const listHtml = `<ol class="list-decimal pl-6 mb-3 space-y-1 text-gray-700">${listLines
                      .filter(l => /^\d+\.\s/.test(l.trim()))
                      .map(l => {
                        const item = l.trim().replace(/^\d+\.\s/, "")
                          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>');
                        return `<li>${item}</li>`;
                      }).join("")}</ol>`;
                    return <div key={j} dangerouslySetInnerHTML={{ __html: listHtml }} />;
                  }

                  let html = paragraph
                    .replace(/\n/g, "<br />")
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 hover:underline">$1</a>');
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

      {/* FIRE診断 CTA */}
      <div className="mt-8 rounded-lg border border-accent-200 bg-accent-50 p-5">
        <h2 className="text-lg font-bold text-gray-800">
          あなたのFIRE達成度は？
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          6つの質問に答えるだけで、FIRE目標額と達成予測年齢を無料診断
        </p>
        <Link
          href="/diagnose/"
          className="mt-3 inline-block text-sm font-medium text-accent-700 hover:text-accent-600 hover:underline"
        >
          FIRE診断を受ける（無料・1分） →
        </Link>
      </div>

      {/* おすすめツール */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-5">
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

      {/* よくある質問（FAQ） */}
      {article.faqs && article.faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-4">
            {article.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors list-none">
                  <span className="flex items-start gap-2 font-medium text-gray-900 text-sm leading-relaxed">
                    <span className="text-blue-500 font-bold shrink-0">Q</span>
                    {faq.q}
                  </span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 mt-0.5">▼</span>
                </summary>
                <div className="px-5 py-4 bg-white text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                  <span className="text-blue-600 font-bold mr-2">A</span>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      <BrokerCtaSection />

      {/* 関連記事 */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-gray-800">関連記事</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/guide/${related.slug}/`}
                className="link-card"
              >
                <p className="font-bold text-gray-800">{related.title}</p>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {related.description}
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
