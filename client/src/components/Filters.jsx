import { Search } from "lucide-react";
import PriceRangeSlider from "./PriceRangeSlider";

export default function Filters({ search, onSearch, sourceFilter, onSourceFilter, sortBy, onSortBy, sources, priceMin, onPriceMin, priceMax, onPriceMax, priceBounds }) {
  return (
    <div className="flex gap-2.5 mb-5 flex-wrap items-center">
      <div className="relative flex-[1_1_220px]">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" />
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
