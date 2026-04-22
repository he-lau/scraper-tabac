import { useState, useEffect, useCallback } from "react";

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    search:       p.get("q")      ?? "",
    sourceFilter: p.get("source") ?? "all",
    sortBy:       p.get("sort")   ?? "date",
    page:         Math.max(1, parseInt(p.get("page") ?? "1", 10)),
    priceMin:     p.get("pmin")   ?? "",
    priceMax:     p.get("pmax")   ?? "",
  };
}

export function useUrlState() {
  const [state, setState] = useState(getParams);

  const set = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (state.search)                p.set("q",      state.search);
    if (state.sourceFilter !== "all") p.set("source", state.sourceFilter);
    if (state.sortBy !== "date")      p.set("sort",   state.sortBy);
    if (state.page > 1)               p.set("page",   state.page);
    if (state.priceMin)               p.set("pmin",   state.priceMin);
    if (state.priceMax)               p.set("pmax",   state.priceMax);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [state]);

  return [state, set];
}
