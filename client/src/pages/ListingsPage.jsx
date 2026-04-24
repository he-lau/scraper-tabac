import { useState } from "react";
import { useT } from "../lang/LanguageContext";
import Sidebar from "../components/Sidebar";
import StatsBar from "../components/StatsBar";
import FiltersModal from "../components/FiltersModal";
import ListingsTable from "../components/ListingsTable";
import Pagination from "../components/Pagination";

export default function ListingsPage({
  listings, loading, error,
  filtered, paginated, page, totalPages,
  search, sourceFilter, sortBy, priceMin, priceMax,
  priceBounds, sources, activeCount,
  set, resetFilters,
}) {
  const { t } = useT();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <div className="text-center py-20 text-[#aaa] text-[13px] font-mono">{t.loading}</div>;

  if (error) return (
    <div className="bg-[#FFF0F0] border border-[#F5BFBF] rounded-lg px-4 py-3 text-[#B00] text-[13px]">
      ⚠ {t.errorLoad} : {error}
    </div>
  );

  return (
    <>
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
        onReset={resetFilters}
      />

      <div className="flex gap-6 items-start">
        <Sidebar listings={listings} activeCount={activeCount} onOpenFilters={() => setModalOpen(true)} />

        <div className="flex-1 min-w-0">
          <div className="lg:hidden mb-4">
            <StatsBar listings={listings} />
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] text-[#999] font-mono m-0">
              {t.results(filtered.length)}
              {activeCount > 0 ? ` · ${t.filtered}` : ""}
              {totalPages > 1 && ` · ${t.page(page, totalPages)}`}
            </p>
            <button
              className={`relative btn lg:hidden ${activeCount > 0 ? "btn-primary" : "btn-secondary"}`}
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

          {filtered.length === 0 && activeCount > 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border border-[#E5E5E0] rounded-xl bg-white">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <div className="text-center">
                <p className="text-[15px] font-semibold m-0">{t.emptyTitle}</p>
                <p className="text-[13px] text-[#888] mt-1 mb-0">{t.emptySubtitle}</p>
              </div>
              <button className="btn-secondary" onClick={resetFilters}>{t.emptyReset}</button>
            </div>
          ) : (
            <>
              <ListingsTable listings={paginated} />
              <Pagination page={page} totalPages={totalPages} onChange={(p) => set({ page: p })} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
