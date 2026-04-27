import { useState, useEffect, useCallback } from "react";
import apiUrl from "../utils/api";

export function useFavorites(token) {
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    if (!token) { setFavoriteIds(new Set()); return; }
    fetch(`${apiUrl}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setFavoriteIds(new Set(data.map((f) => f.id))))
      .catch(() => {});
  }, [token]);

  const toggle = useCallback(async (listingId) => {
    if (!token) return;
    const isFav = favoriteIds.has(listingId);
    // optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(listingId) : next.add(listingId);
      return next;
    });
    try {
      const res = await fetch(`${apiUrl}/api/favorites/${listingId}`, {
        method: isFav ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 409) throw new Error();
    } catch {
      // rollback on unexpected error
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(listingId) : next.delete(listingId);
        return next;
      });
    }
  }, [token, favoriteIds]);

  return { favoriteIds, toggle };
}
