import Link from "next/link";

interface Props {
  heading?: string;
  description?: string;
  className?: string;
}

export default function DiagnoseCtaSection({
  heading = "FIRE達成度をチェック",
  description = "6つの質問であなたのFIREグレードを判定",
  className = "mt-6",
}: Props) {
  return (
    <div
      className={`rounded-lg border border-accent-200 bg-accent-50 p-5 text-center ${className}`}
    >
      <p className="font-bold text-accent-800">{heading}</p>
      <p className="mt-1 text-sm text-accent-700">{description}</p>
      <Link
        href="/diagnose/"
        className="mt-3 inline-block rounded-lg bg-accent-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-700"
      >
        約1分でFIRE診断
      </Link>
    </div>
  );
}
