import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Watchlist from "./pages/Watchlist";

import Home from "./pages/Home";
import Details from "./pages/Details";
import Navbar from "./components/Navbar";

function App() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const location = useLocation();

  const addToWatchlist = (anime) => {
    if (!watchlist.find((a) => a.id === anime.id)) {
      setWatchlist([...watchlist, anime]);
    }
  };

  const removeFromWatchlist = (id) => {
    setWatchlist(watchlist.filter((anime) => anime.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <>
      <Navbar watchlistCount={watchlist.length} />

      <AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>

    <Route
      path="/"
      element={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Home
            addToWatchlist={addToWatchlist}
            watchlist={watchlist}
          />
        </motion.div>
      }
    />

    <Route
      path="/anime/:id"
      element={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Details />
        </motion.div>
      }
    />

    <Route
      path="/watchlist"
      element={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Watchlist
            watchlist={watchlist}
            removeFromWatchlist={removeFromWatchlist}
          />
        </motion.div>
      }
    />

  </Routes>
</AnimatePresence>
    </>
  );
}

export default App;