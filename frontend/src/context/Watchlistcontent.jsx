import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  function getToken() {
    return localStorage.getItem("token");
  }

  const fetchWatchlist = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-sync whenever auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [isAuthenticated, fetchWatchlist]);

  const addToWatchlist = useCallback(async (anime) => {
    const token = getToken();
    if (!token) return;

    setWatchlist((prev) => (prev.find((a) => a.id === anime.id) ? prev : [...prev, anime]));

    try {
      const res = await fetch(`${API_BASE}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ animeId: anime.id }),
      });
      if (!res.ok) setWatchlist((prev) => prev.filter((a) => a.id !== anime.id));
    } catch {
      setWatchlist((prev) => prev.filter((a) => a.id !== anime.id));
    }
  }, []);

  const removeFromWatchlist = useCallback(async (id) => {
    const token = getToken();
    if (!token) return;

    const previous = watchlist;
    setWatchlist((prev) => prev.filter((a) => a.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/watchlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) setWatchlist(previous);
    } catch {
      setWatchlist(previous);
    }
  }, [watchlist]);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, loading, addToWatchlist, removeFromWatchlist, fetchWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWatchlist() {
  return useContext(WatchlistContext);
}
