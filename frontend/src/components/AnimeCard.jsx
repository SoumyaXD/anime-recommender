import { useNavigate } from "react-router-dom";
import "./AnimeCard.css";

function AnimeCard({ id, title, rating, image, addToWatchlist, watchlist }) {
  const navigate = useNavigate();

  const anime = { id, title, rating };
  const isAdded = watchlist?.some(a => a.id === id);

  return (
    <div className="card" onClick={() => navigate(`/anime/${id}`)}>
      <img src={image} alt={title} />

      <h3>{title}</h3>

      <p>⭐ {rating}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          addToWatchlist(anime);
        }}
        disabled={isAdded}
        className={isAdded ? "added" : "primary"}
      >
        {isAdded ? "Added ✓" : "Add to Watchlist"}
      </button>
    </div>
  );
}

export default AnimeCard;