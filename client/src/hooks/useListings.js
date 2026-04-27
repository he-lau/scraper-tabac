import { useState, useEffect, useCallback } from "react";

// Les appels /api utilisent REACT_APP_API_URL
export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8001";
  

  // useCallback pour mettre en cache la fonction pour éviter le re-render infini
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/api/listings?all=1`);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      // MAJ datas
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      // fin de la requête, maj l'UI
      setLoading(false);
    }
  }, []);

  // requête à l'api après render
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, loading, error, refetch: fetchListings };
}
