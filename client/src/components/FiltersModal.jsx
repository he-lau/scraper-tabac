import { useEffect } from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import { useT } from "../lang/LanguageContext";

export default function FiltersModal({
  open, onClose,
  search, onSearch,
  sourceFilter, onSourceFilter,
  sortBy, onSortBy,
  sources,
  priceMin, onPriceMin,
  priceMax, onPriceMax,
  priceBounds,
  activeCount, onReset,
}) {
  const { t } = useT();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6 flex flex-col gap-5 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">{t.filterTitle}</h2>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-[12px] text-[#888] hover:text-[#1a1a1a] cursor-pointer underline underline-offset-2"
              >
                {t.reset}
              </button>
            )}
            <button onClick={onClose} className="text-[#aaa] hover:text-[#1a1a1a] cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.search}</label>
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-3 h-9 border border-[#E5E5E0] rounded-lg text-[13px] bg-white outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.source}</label>
          <select
            value={sourceFilter}
            onChange={(e) => onSourceFilter(e.target.value)}
            className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white cursor-pointer"
          >
            <option value="all">{t.allSources}</option>
            {sources.map((src) => <option key={src} value={src}>{src}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.sort}</label>
          <select
            value={sortBy}
            onChange={(e) => onSortBy(e.target.value)}
            className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white cursor-pointer"
          >
            <option value="date">{t.sortDate}</option>
            <option value="price_asc">{t.sortPriceAsc}</option>
            <option value="price_desc">{t.sortPriceDesc}</option>
          </select>
        </div>

        {priceBounds && priceBounds.max > priceBounds.min && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#888] uppercase tracking-[0.08em] font-semibold">{t.price}</label>
            <PriceRangeSlider
              min={priceBounds.min}
              max={priceBounds.max}
              valueMin={priceMin !== "" ? Number(priceMin) : priceBounds.min}
              valueMax={priceMax !== "" ? Number(priceMax) : priceBounds.max}
              onChangeMin={(v) => onPriceMin(v === priceBounds.min ? "" : String(v))}
              onChangeMax={(v) => onPriceMax(v === priceBounds.max ? "" : String(v))}
            />
          </div>
        )}

        <button
          onClick={onClose}
          className="btn-primary w-full justify-center mt-1"
        >
          {t.seeResults}
        </button>
      </div>
    </div>
  );
}
