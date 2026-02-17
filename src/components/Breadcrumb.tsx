import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <>
      <nav aria-label="パンくずリスト" className="mb-6 text-sm text-gray-500">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-1">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.label,
              ...(item.href ? { item: item.href } : {}),
            })),
          }),
        }}
      />
    </>
  );
}
