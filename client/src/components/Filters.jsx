import PriceRangeSlider from "./PriceRangeSlider";

export default function Filters({ search, onSearch, sourceFilter, onSourceFilter, sortBy, onSortBy, sources, priceMin, onPriceMin, priceMax, onPriceMax, priceBounds }) {
  return (
    <div className="flex gap-2.5 mb-5 flex-wrap items-center">
      <div className="relative flex-[1_1_220px]">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher titre, région…"
          className="w-full pl-8 pr-3 h-9 border border-[#E5E5E0] rounded-lg text-[13px] bg-white outline-none box-border"
        />
      </div>

      <select
        value={sourceFilter}
        onChange={(e) => onSourceFilter(e.target.value)}
        className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white cursor-pointer"
      >
        <option value="all">Toutes les sources</option>
        {sources.map((src) => (
          <option key={src} value={src}>{src}</option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortBy(e.target.value)}
        className="h-9 border border-[#E5E5E0] rounded-lg px-3 text-[13px] bg-white cursor-pointer"
      >
        <option value="date">Plus récent</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix décroissant</option>
      </select>

      {priceBounds && priceBounds.max > priceBounds.min && (
        <PriceRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          valueMin={priceMin !== "" ? Number(priceMin) : priceBounds.min}
          valueMax={priceMax !== "" ? Number(priceMax) : priceBounds.max}
          onChangeMin={(v) => onPriceMin(v === priceBounds.min ? "" : String(v))}
          onChangeMax={(v) => onPriceMax(v === priceBounds.max ? "" : String(v))}
        />
      )}
    </div>
  );
}
