import { useMemo, useState } from "react";
import { useListings } from "./hooks/useListings";
import { useUrlState } from "./hooks/useUrlState";
import { useT } from "./lang/LanguageContext";
import StatsBar from "./components/StatsBar";
import FiltersModal from "./components/FiltersModal";
import ListingsTable from "./components/ListingsTable";
import Pagination from "./components/Pagination";
import { exportCSV } from "./utils/exportCSV";

const PAGE_SIZE = 20;

export default function App() {
  const { listings, loading, error, refetch } = useListings();
  const [{ search, sourceFilter, sortBy, page, priceMin, priceMax }, set] = useUrlState();
  const [modalOpen, setModalOpen] = useState(false);
  const { t, lang, toggle } = useT();

  const activeCount = [
    search !== "",
    sourceFilter !== "all",
    sortBy !== "date",
    priceMin !== "",
    priceMax !== "",
  ].filter(Boolean).length;

  const sources = useMemo(() => [...new Set(listings.map((l) => l.source))], [listings]);

  const priceBounds = useMemo(() => {
    const prices = listings.map((l) => l.price).filter(Boolean);
    if (!prices.length) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [listings]);

  const filtered = useMemo(() => {
    let d = listings;
    if (sourceFilter !== "all") d = d.filter((l) => l.source === sourceFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter((l) =>
        l.title?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.region?.toLowerCase().includes(q) ||
        l.department?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q)
      );
    }
    const min = priceMin !== "" ? Number(priceMin) : null;
    const max = priceMax !== "" ? Number(priceMax) : null;
    if (min !== null) d = d.filter((l) => !l.price || l.price >= min);
    if (max !== null) d = d.filter((l) => !l.price || l.price <= max);
    if (sortBy === "date")       d = [...d].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "price_asc")  d = [...d].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price_desc") d = [...d].sort((a, b) => (b.price || 0) - (a.price || 0));
    return d;
  }, [listings, search, sourceFilter, sortBy, priceMin, priceMax]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 text-[#1a1a1a]">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
        <div>
          <p className="text-[11px] font-mono text-[#888] tracking-[0.1em] uppercase mb-1">{t.eyebrow}</p>
          <h1 className="text-[26px] font-semibold tracking-tight m-0">{t.title}</h1>
        </div>
        <div className="flex gap-2.5 items-center">
          <button
            className="flex items-center gap-1.5 border border-[#E5E5E0] rounded-lg px-4 py-2 text-[13px] font-medium cursor-pointer bg-white text-[#1a1a1a]"
            onClick={refetch}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {t.refresh}
          </button>
          <button
            className="flex items-center gap-1.5 border-0 rounded-lg px-4 py-2 text-[13px] font-medium cursor-pointer bg-[#1a1a1a] text-white"
            onClick={() => exportCSV(filtered)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {t.export} ({filtered.length})
          </button>
          <div className="flex items-center border border-[#E5E5E0] rounded-lg overflow-hidden text-[12px] font-medium ml-auto">
            {["fr", "zh"].map((l) => (
              <button
                key={l}
                onClick={() => l !== lang && toggle()}
                className={`px-3 py-1.5 cursor-pointer transition-colors ${lang === l ? "bg-[#1a1a1a] text-white" : "bg-white text-[#888] hover:text-[#1a1a1a]"}`}
              >
                {l === "fr" ? "FR" : "中文"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-[#FFF0F0] border border-[#F5BFBF] rounded-lg px-4 py-3 text-[#B00] text-[13px] mb-6">
          ⚠ {t.errorLoad} : {error}
        </div>
      )}
      {loading && (
        <div className="text-center py-16 text-[#aaa] text-[13px] font-mono">{t.loading}</div>
      )}

      <FiltersModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        search={search}             onSearch={(v) => set({ search: v, page: 1 })}
        sourceFilter={sourceFilter} onSourceFilter={(v) => set({ sourceFilter: v, page: 1 })}
        sortBy={sortBy}             onSortBy={(v) => set({ sortBy: v, page: 1 })}
        priceMin={priceMin}         onPriceMin={(v) => set({ priceMin: v, page: 1 })}
        priceMax={priceMax}         onPriceMax={(v) => set({ priceMax: v, page: 1 })}
        priceBounds={priceBounds}
        sources={sources}
        activeCount={activeCount}
        onReset={() => set({ search: "", sourceFilter: "all", sortBy: "date", priceMin: "", priceMax: "", page: 1 })}
      />

      {!loading && !error && (
        <>
          <StatsBar listings={listings} />
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] text-[#999] font-mono m-0">
              {t.results(filtered.length)}
              {activeCount > 0 ? ` · ${t.filtered}` : ""}
              {totalPages > 1 && ` · ${t.page(page, totalPages)}`}
            </p>
            <button
              className={`relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium cursor-pointer border transition-colors ${activeCount > 0 ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-[#1a1a1a] border-[#C0C0BB] hover:border-[#1a1a1a]"}`}
              onClick={() => setModalOpen(true)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              {t.filters}
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white text-[#1a1a1a] text-[10px] flex items-center justify-center font-semibold border border-[#1a1a1a]">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
          <ListingsTable listings={paginated} />
          <Pagination page={page} totalPages={totalPages} onChange={(p) => set({ page: p })} />
        </>
      )}
    </div>
  );
}
