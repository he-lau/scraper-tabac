import { ListFilter } from "lucide-react";
import { fmtPrice } from "../utils/format";
import { useT } from "../lang/LanguageContext";

export default function Sidebar({ listings, activeCount, onOpenFilters }) {
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
    <aside className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0">
      <div className="bg-[#F7F7F5] rounded-xl p-4 flex flex-col gap-3">
        {stats.map((stat, i) => (
          <div key={i} className={i < stats.length - 1 ? "pb-3 border-b border-[#EBEBЕ7]" : ""}>
            <p className="text-[10px] text-[#aaa] font-mono uppercase tracking-[0.08em] mb-0.5 mt-0">{stat.label}</p>
            <p className="text-[17px] font-semibold tracking-tight m-0">{stat.value}</p>
          </div>
        ))}
      </div>

      <button
        className={`relative btn w-full justify-center ${activeCount > 0 ? "btn-primary" : "btn-secondary"}`}
        onClick={onOpenFilters}
      >
        <ListFilter size={13} />
        {t.filters}
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-[#1a1a1a] text-[10px] flex items-center justify-center font-semibold border border-[#1a1a1a]">
            {activeCount}
          </span>
        )}
      </button>
    </aside>
  );
}
