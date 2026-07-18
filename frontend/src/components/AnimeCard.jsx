import { useNavigate } from "react-router-dom";
import "./AnimeCard.css";
import { useWatchlist } from "../context/Watchlistcontent";
import { useAuth } from "../context/AuthContext";

function AnimeCard({ id, title, rating, image, description, genres }) {
  const navigate = useNavigate();
  const { watchlist, addToWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();
  const anime = { id, title, rating, image, description, genres };
  const isAdded = watchlist?.some((a) => a.id === id);
  const genreLine = Array.isArray(genres) && genres.length > 0 ? genres.slice(0, 2).join(" | ") : "Genre: Unknown";

  function handleWatchlist(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    addToWatchlist(anime);
  }

  return (
    <div className="card" onClick={() => navigate(`/anime/${id}`)}>
      <img src={image} alt={title} />

      <h3>{title}</h3>

      <p>Rating: {rating}</p>
      <p className="card-genres">{genreLine}</p>
      <p className="card-description">{description || "Description not available."}</p>

      <button
        onClick={handleWatchlist}
        disabled={isAdded}
        className={isAdded ? "added" : "primary"}
      >
        {isAdded ? "Added" : "Add to Watchlist"}
      </button>
    </div>
  );
}

export default AnimeCard;
