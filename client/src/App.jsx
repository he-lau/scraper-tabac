import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useListings } from "./hooks/useListings";
import { useUrlState } from "./hooks/useUrlState";
import { useT } from "./lang/LanguageContext";
import DashboardLayout from "./components/DashboardLayout";
import AppRoutes from "./routes";
import { exportCSV } from "./utils/exportCSV";

const PAGE_SIZE = 20;

export default function App() {
  const { listings, loading, error, refetch } = useListings();
  const [{ search, sourceFilter, sortBy, page, priceMin, priceMax }, set] = useUrlState();
  const { t } = useT();
  const { pathname } = useLocation();

  const resetFilters = () => set({ search: "", sourceFilter: "all", sortBy: "date", priceMin: "", priceMax: "", page: 1 });

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

  const isStats = pathname === "/stats";

  const headerActions = !isStats ? (
    <>
      <button className="btn-secondary" onClick={refetch}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span className="hidden sm:inline">{t.refresh}</span>
      </button>
      <button className="btn-primary" onClick={() => exportCSV(filtered)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
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
        activeCount={activeCount} set={set} resetFilters={resetFilters}
      />
    </DashboardLayout>
  );
}
