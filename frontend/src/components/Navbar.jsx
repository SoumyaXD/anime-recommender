import { Link } from "react-router-dom";
function Navbar({ watchlistCount }) {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px",
      background: "#111",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Anime Recommender
      </Link>

      <Link to="/watchlist" style={{ color: "white", textDecoration: "none" }}>
        Watchlist ({watchlistCount})
      </Link>
    </nav>
  );
}

export default Navbar;