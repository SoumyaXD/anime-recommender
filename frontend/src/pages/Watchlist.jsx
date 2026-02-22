function Watchlist({ watchlist, removeFromWatchlist }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p>No anime added yet.</p>
      ) : (
        watchlist.map((anime) => (
          <div key={anime.id}>
            <h3>{anime.title}</h3>
            <p>⭐ {anime.rating}</p>
            <button onClick={() => removeFromWatchlist(anime.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Watchlist;