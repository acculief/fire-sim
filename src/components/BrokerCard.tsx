import type { Broker } from "@/data/recommend";

interface Props {
  broker: Broker;
}

export default function BrokerCard({ broker: b }: Props) {
  return (
    <div className="rounded-lg border border-white bg-white p-4">
      <div className="flex items-center gap-2">
        <h4 className="font-bold text-gray-800">{b.name}</h4>
        <span className="rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
          おすすめ
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">{b.description}</p>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
        {b.features.slice(0, 2).map((f, i) => (
          <li key={i} className="flex items-center">
            <span className="mr-1 text-accent-500">✓</span>{f}
          </li>
        ))}
      </ul>
      <a
        href={b.affiliateUrl ?? b.url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="mt-3 inline-block rounded-lg bg-accent-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-accent-700"
      >
        無料で口座開設 <span className="text-xs opacity-75">PR</span>
      </a>
      {b.trackingPixel && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={b.trackingPixel} width={1} height={1} alt="" className="inline" />
      )}
    </div>
  );
}
