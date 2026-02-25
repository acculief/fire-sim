import Link from "next/link";
import { brokers } from "@/data/recommend";
import BrokerCard from "@/components/BrokerCard";

const affiliateBrokers = brokers.filter((b) => b.isAffiliate);

interface Props {
  heading?: string;
  description?: string;
  className?: string;
}

export default function BrokerCtaSection({
  heading = "FIRE達成に向けて証券口座を準備しよう",
  description = "新NISAを活用すれば運用益が非課税に。まずは口座開設から始めましょう",
  className = "mt-8",
}: Props) {
  if (affiliateBrokers.length === 0) return null;

  return (
    <div className={`rounded-xl border-2 border-accent-200 bg-accent-50 p-6 ${className}`}>
      <h3 className="mb-1 text-center text-lg font-bold text-accent-800">
        {heading}
      </h3>
      <p className="mb-4 text-center text-xs text-gray-600">
        {description}
      </p>
      <div className="space-y-3">
        {affiliateBrokers.map((b) => (
          <BrokerCard key={b.slug} broker={b} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
        <Link href="/guide/how-to-choose-broker/" className="inline-flex min-h-[44px] items-center text-accent-700 underline hover:text-accent-600">
          証券口座の選び方ガイド
        </Link>
        <Link href="/guide/nisa-fire-acceleration/" className="inline-flex min-h-[44px] items-center text-accent-700 underline hover:text-accent-600">
          新NISAでFIRE加速
        </Link>
      </div>
    </div>
  );
}
