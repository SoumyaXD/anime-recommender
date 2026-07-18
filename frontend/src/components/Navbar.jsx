import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ watchlistCount }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 24px",
      background: "#111",
      color: "white",
      flexWrap: "wrap",
      gap: "12px",
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}>
        Anime Recommender
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/watchlist" style={{ color: "white", textDecoration: "none" }}>
          Watchlist ({watchlistCount})
        </Link>

        {isAuthenticated ? (
          <>
            <span style={{ color: "#a5b4fc", fontSize: "14px" }}>
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #6366f1",
                color: "#a5b4fc",
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            style={{
              background: "#6366f1",
              color: "white",
              padding: "6px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
