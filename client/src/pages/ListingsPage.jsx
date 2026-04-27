import { useState } from "react";
import { ListFilter, Search } from "lucide-react";
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
  setUrlState, resetFilters, expandedId, onExpand,
}) {
  const { t } = useT();
  // etat du modal de filtre
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <div className="text-center py-20 text-[#aaa] text-[13px] font-mono">{t.loading}</div>;

  if (error) return (
    <div className="bg-[#FFF0F0] border border-[#F5BFBF] rounded-lg px-4 py-3 text-[#B00] text-[13px]">
      ⚠ {t.errorLoad} : {error}
    </div>
  );

  return (
    <>
      {/** Composant du filtre auquel on passe les customs handlers  */}
      <FiltersModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        search={search}             onSearch={(v) => setUrlState({ search: v, page: 1 })}
        sourceFilter={sourceFilter} onSourceFilter={(v) => setUrlState({ sourceFilter: v, page: 1 })}
        sortBy={sortBy}             onSortBy={(v) => setUrlState({ sortBy: v, page: 1 })}
        priceMin={priceMin}         onPriceMin={(v) => setUrlState({ priceMin: v, page: 1 })}
        priceMax={priceMax}         onPriceMax={(v) => setUrlState({ priceMax: v, page: 1 })}
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
              <ListFilter size={13} />
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
              <Search size={36} stroke="#ccc" strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-[15px] font-semibold m-0">{t.emptyTitle}</p>
                <p className="text-[13px] text-[#888] mt-1 mb-0">{t.emptySubtitle}</p>
              </div>
              <button className="btn-secondary" onClick={resetFilters}>{t.emptyReset}</button>
            </div>
          ) : (
            <>
              <ListingsTable listings={paginated} expandedId={expandedId} onExpand={onExpand} />
              <Pagination page={page} totalPages={totalPages} onChange={(p) => setUrlState({ page: p })} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
