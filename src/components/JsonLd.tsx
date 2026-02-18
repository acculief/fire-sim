/**
 * JSON-LD 構造化データを埋め込むヘルパーコンポーネント
 * 17+ ページで繰り返される dangerouslySetInnerHTML パターンを共通化
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
