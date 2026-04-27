import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { RefreshCw, Download } from "lucide-react";
import { useListings } from "./hooks/useListings";
import { useUrlState } from "./hooks/useUrlState";
import { useT } from "./lang/LanguageContext";
import DashboardLayout from "./components/DashboardLayout";
import AppRoutes from "./routes";
import { exportCSV } from "./utils/exportCSV";

// Nombre d'éléments à afficher
const PAGE_SIZE = 20;

export default function App() {
  const { listings, loading, error, refetch } = useListings();
  const [{ search, sourceFilter, sortBy, page, priceMin, priceMax, listing }, setUrlState] = useUrlState();
  const { t } = useT();
  const { pathname } = useLocation();
  // filtre par défaut
  const resetFilters = () => setUrlState({ search: "", sourceFilter: "all", sortBy: "date", priceMin: "", priceMax: "", page: 1 });

  // nombre de filtre activé
  const activeCount = [
    search !== "",
    sourceFilter !== "all",
    sortBy !== "date",
    priceMin !== "",
    priceMax !== "",
  ].filter(Boolean).length;

  // liste des sources gardé en mémoire
  const sources = useMemo(() => [...new Set(listings.map((l) => l.source))], [listings]);

  // prix min & max
  const priceBounds = useMemo(() => {
    const prices = listings.map((l) => l.price).filter(Boolean);
    if (!prices.length) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [listings]);

  // annonces filtrées, useMemo pour éviter les itérations inutiles si pas de changement
  const filtered = useMemo(() => {
    let d = listings;
    // sources
    if (sourceFilter !== "all") d = d.filter((l) => l.source === sourceFilter);
    // si recherche non vide
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
    // min & max
    const min = priceMin !== "" ? Number(priceMin) : null;
    const max = priceMax !== "" ? Number(priceMax) : null;
    if (min !== null) d = d.filter((l) => !l.price || l.price >= min);
    if (max !== null) d = d.filter((l) => !l.price || l.price <= max);

    // tri
    if (sortBy === "date")       d = [...d].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === "price_asc")  d = [...d].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price_desc") d = [...d].sort((a, b) => (b.price || 0) - (a.price || 0));
    // liste filtrée
    return d;
  }, [listings, search, sourceFilter, sortBy, priceMin, priceMax]);

  // pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isStats = pathname === "/stats";

  // actions : actualiser + export csv
  const headerActions = !isStats ? (
    <>
      <button className="btn-secondary" onClick={refetch}>
        <RefreshCw size={12} />
        <span className="hidden sm:inline">{t.refresh}</span>
      </button>
      <button className="btn-primary" onClick={() => exportCSV(filtered)}>
        <Download size={12} />
        <span className="hidden sm:inline">{t.export} ({filtered.length})</span>
      </button>
    </>
  ) : null;

  return (
    <DashboardLayout title={isStats ? t.navStats : t.navListings} actions={headerActions}>
      <AppRoutes
        listings={listings} loading={loading} error={error}
        filtered={filtered} paginated={paginated}
        page={page} totalPages={totalPages}
        search={search} sourceFilter={sourceFilter} sortBy={sortBy}
        priceMin={priceMin} priceMax={priceMax}
        priceBounds={priceBounds} sources={sources}
        activeCount={activeCount} setUrlState={setUrlState} resetFilters={resetFilters}
        expandedId={listing} onExpand={(id) => setUrlState({ listing: id })}
      />
    </DashboardLayout>
  );
}
