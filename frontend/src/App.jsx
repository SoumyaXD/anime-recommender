import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Watchlist from "./pages/Watchlist";

import Home from "./pages/Home";
import Details from "./pages/Details";
import Navbar from "./components/Navbar";
import { useWatchlist } from "./context/Watchlistcontent";

function App() {
    const location = useLocation();
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const FadeDiv = motion.div;
  return (
    <>
      <Navbar watchlistCount={watchlist.length} />

      <AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>

    <Route
      path="/"
      element={
        <FadeDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Home/>
        </FadeDiv>
      }
    />

    <Route
      path="/anime/:id"
      element={
        <FadeDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Details />
        </FadeDiv>
      }
    />

    <Route
      path="/watchlist"
      element={
        <FadeDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Watchlist
            watchlist={watchlist}
            removeFromWatchlist={removeFromWatchlist}
          />
        </FadeDiv>
      }
    />

  </Routes>
</AnimatePresence>
    </>
  );
}

export default App;
