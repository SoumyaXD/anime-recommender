import { useEffect, useMemo, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import { fetchAnime } from "../services/api";
import "./Home.css";

const ROW_SKELETON_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"];
const GRID_SKELETON_KEYS = ["grid-1", "grid-2", "grid-3", "grid-4", "grid-5", "grid-6"];

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    let isActive = true;

    const loadAnime = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchAnime();
        if (isActive) {
          setAnimeList(data);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadAnime();

    return () => {
      isActive = false;
    };
  }, []);

  const popularAnime = useMemo(() => animeList.slice(0, 5), [animeList]);
  const popularIds = useMemo(() => new Set(popularAnime.map((anime) => anime.id)), [popularAnime]);

  const filteredAnime = useMemo(
    () =>
      animeList.filter((anime) =>
        `${anime.title} ${(anime.genres || []).join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [animeList, search]
  );

  const browseAnime = useMemo(
    () => filteredAnime.filter((anime) => !popularIds.has(anime.id)),
    [filteredAnime, popularIds]
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
        disabled={loading}
      />

      {loading ? (
        <>
          <h2 className="row-title">Popular Now</h2>
          <div className="row">
            {ROW_SKELETON_KEYS.map((key) => (
              <div key={key} className="row-item skeleton-card" />
            ))}
          </div>

          <div className="section">
            <h2 className="section-title">Browse All</h2>
            <div className="grid">
              {GRID_SKELETON_KEYS.map((key) => (
                <div key={key} className="skeleton-card" />
              ))}
            </div>
          </div>
        </>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2 className="row-title">Popular Now</h2>
          <div className="row">
            {popularAnime.map((anime) => (
              <div className="row-item" key={anime.id}>
                <AnimeCard
                  id={anime.id}
                  title={anime.title}
                  rating={anime.rating}
                  image={anime.image}
                  description={anime.description}
                  genres={anime.genres}
                />
              </div>
            ))}
          </div>

          <div className="section">
            <h2 className="section-title">Browse All</h2>
            <div className="grid">
              {browseAnime.length === 0 ? (
                <p className="empty-message">No anime found.</p>
              ) : (
                browseAnime.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    id={anime.id}
                    title={anime.title}
                    rating={anime.rating}
                    image={anime.image}
                    description={anime.description}
                    genres={anime.genres}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
