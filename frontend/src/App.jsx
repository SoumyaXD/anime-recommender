import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Watchlist from "./pages/Watchlist";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import { useWatchlist } from "./context/Watchlistcontent";

const FadeDiv = motion.div;
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } };

function App() {
  const location = useLocation();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <>
      <Navbar watchlistCount={watchlist.length} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={<FadeDiv {...fade}><Home /></FadeDiv>} />

          <Route path="/anime/:id" element={<FadeDiv {...fade}><Details /></FadeDiv>} />

          <Route
            path="/watchlist"
            element={
              <FadeDiv {...fade}>
                <Watchlist watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />
              </FadeDiv>
            }
          />

          <Route path="/auth" element={<FadeDiv {...fade}><Auth /></FadeDiv>} />

        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
