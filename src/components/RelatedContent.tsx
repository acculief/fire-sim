import Link from "next/link";

interface RelatedItem {
  href: string;
  title: string;
  description: string;
}

interface Props {
  items: RelatedItem[];
  heading?: string;
}

export default function RelatedContent({ items, heading = "関連コンテンツ" }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-gray-800">{heading}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <p className="font-bold text-gray-800">{item.title}</p>
            <p className="mt-1 text-xs text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
