import { createContext, useContext, useEffect, useState } from "react";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const addToWatchlist = (anime) => {
    setWatchlist((prev) => {
      if (prev.find((a) => a.id === anime.id)) return prev;
      return [...prev, anime];
    });
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((anime) => anime.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWatchlist() {
  return useContext(WatchlistContext);
}
