import { createContext, useCallback, useContext, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const WatchlistContext = createContext();

function getToken() {
  return localStorage.getItem("token");
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(getToken());

  // Fetch full watchlist from server
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
      // silently fail — watchlist stays empty
    } finally {
      setLoading(false);
    }
  }, []);

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

    // Optimistic update
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

      if (!res.ok) {
        // Rollback on failure
        setWatchlist((prev) => prev.filter((a) => a.id !== anime.id));
      }
    } catch {
      setWatchlist((prev) => prev.filter((a) => a.id !== anime.id));
    }
  }, []);

  const removeFromWatchlist = useCallback(async (id) => {
    const token = getToken();
    if (!token) return;

    // Optimistic update
    const previous = watchlist;
    setWatchlist((prev) => prev.filter((a) => a.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/watchlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setWatchlist(previous);
      }
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
