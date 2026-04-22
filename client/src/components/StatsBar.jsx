import { fmtPrice } from "../utils/format";
import { useT } from "../lang/LanguageContext";

export default function StatsBar({ listings }) {
  const { t } = useT();
  const prices = listings.filter((l) => l.price).map((l) => l.price);
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const sources = [...new Set(listings.map((l) => l.source))];
  const sourceCounts = sources.map((src) => ({
    label: src,
    value: listings.filter((l) => l.source === src).length + " " + t.ann,
  }));

  const stats = [
    { label: t.statTotal,    value: listings.length },
    { label: t.statAvgPrice, value: fmtPrice(avgPrice) },
    { label: t.statMaxPrice, value: fmtPrice(maxPrice) },
    ...sourceCounts,
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-7">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#F2F2EE] rounded-[10px] px-4 py-3.5">
          <p className="text-[11px] text-[#888] font-mono uppercase tracking-[0.08em] mb-1 mt-0">{stat.label}</p>
          <p className="text-[20px] font-semibold tracking-tight m-0">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
