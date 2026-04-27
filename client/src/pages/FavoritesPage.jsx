import { useT } from "../lang/LanguageContext";
import ListingsTable from "../components/ListingsTable";
import { Heart } from "lucide-react";

export default function FavoritesPage({ listings, favoriteIds, onToggleFavorite, isAuthenticated, expandedId, onExpand }) {
  const { t } = useT();
  const favorites = listings.filter((l) => favoriteIds.has(l.id));

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 border border-[#E5E5E0] rounded-xl bg-white">
        <Heart size={36} stroke="#ccc" strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-[15px] font-semibold m-0">{t.favEmptyTitle}</p>
          <p className="text-[13px] text-[#888] mt-1 mb-0">{t.favEmptySubtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <ListingsTable
      listings={favorites}
      expandedId={expandedId}
      onExpand={onExpand}
      favoriteIds={favoriteIds}
      onToggleFavorite={onToggleFavorite}
      isAuthenticated={isAuthenticated}
    />
  );
}
