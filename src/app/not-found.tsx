import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-6xl font-bold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        ページが見つかりませんでした
      </h1>
      <p className="mt-2 text-gray-600">
        お探しのページは移動または削除された可能性があります。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          トップページへ
        </Link>
        <Link href="/simulate/" className="btn-secondary">
          シミュレーション
        </Link>
        <Link href="/guide/" className="btn-secondary">
          ガイド記事一覧
        </Link>
      </div>
    </div>
  );
}
