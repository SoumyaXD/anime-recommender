function Watchlist({ watchlist, removeFromWatchlist }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p>No anime added yet.</p>
      ) : (
        watchlist.map((anime) => (
          <div
            key={anime.id}
            style={{
              marginBottom: "20px",
              padding: "16px",
              borderRadius: "12px",
              background: "#f8fafc",
              maxWidth: "640px",
            }}
          >
            {anime.image ? (
              <img
                src={anime.image}
                alt={anime.title}
                style={{ width: "120px", borderRadius: "8px", marginBottom: "10px" }}
              />
            ) : null}

            <h3>{anime.title}</h3>
            <p>Rating: {anime.rating ?? "N/A"}</p>
            <p>Genres: {Array.isArray(anime.genres) && anime.genres.length > 0 ? anime.genres.join(", ") : "Unknown"}</p>
            <p>{anime.description || "Description not available."}</p>
            <button onClick={() => removeFromWatchlist(anime.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Watchlist;
