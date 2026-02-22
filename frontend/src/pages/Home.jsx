import AnimeCard from "../components/AnimeCard";
import { animeList } from "../data/anime";
import { useState } from "react";
import "./Home.css";

function Home({ addToWatchlist, watchlist }) {
  const [search, setSearch] = useState("");

  const filteredAnime = animeList.filter(anime =>
    anime.title.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="home">
  <h1 className="home-title">Recommended Anime</h1>

  <input
    type="text"
    placeholder="Search anime..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-input"
  />
  <h2 className="row-title">🔥 Popular Now</h2>

<div className="row">
  {animeList.slice(0, 5).map((anime) => (
    <div style={{ minWidth: "220px" }} key={anime.id}>
      <AnimeCard
        id={anime.id}
        title={anime.title}
        rating={anime.rating}
        image={anime.image}
        addToWatchlist={addToWatchlist}
        watchlist={watchlist}
      />
    </div>
  ))}
</div>
  <div className="section">
  <h2 className="section-title">📦 Browse All</h2>

  <div className="grid">
  {filteredAnime.length === 0 ? (
    <p className="empty-message">No anime found.</p>
  ) : (
    filteredAnime
      .filter(
        anime => !animeList.slice(0, 5).some(a => a.id === anime.id)
      )
      .map(anime => (
        <AnimeCard
          key={anime.id}
          id={anime.id}
          title={anime.title}
          rating={anime.rating}
          image={anime.image}
          addToWatchlist={addToWatchlist}
          watchlist={watchlist}
        />
      ))
  )}
</div>
</div>
</div>
  );
}

export default Home;