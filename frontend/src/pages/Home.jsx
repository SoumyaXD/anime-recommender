import { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import { fetchAnime } from "../services/api";
import "./Home.css";

const ROW_SKELETON_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"];
const GRID_SKELETON_KEYS = ["grid-1", "grid-2", "grid-3", "grid-4", "grid-5", "grid-6"];
const POPULAR_LIMIT = 5;

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search input — 350ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when search or genre changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedGenre]);

  // Fetch popular strip once on mount (unaffected by search/pagination)
  useEffect(() => {
    fetchAnime({ page: 1, limit: POPULAR_LIMIT })
      .then((res) => setPopularList(res.data))
      .catch(() => {});
  }, []);

  // Fetch paginated/filtered browse grid
  useEffect(() => {
    let isActive = true;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetchAnime({
          page: currentPage,
          limit: 20,
          search: debouncedSearch,
          genre: selectedGenre,
        });
        if (isActive) {
          setAnimeList(res.data);
          setPaginationMeta(res.meta);
        }
      } catch (err) {
        if (isActive) setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => { isActive = false; };
  }, [currentPage, debouncedSearch, selectedGenre]);

  const popularIds = new Set(popularList.map((a) => a.id));
  const browseAnime = animeList.filter((a) => !popularIds.has(a.id));

  return (
    <div className="home">
      <h1 className="home-title">Recommended Anime</h1>

      <div className="search-row">
        <input
          type="text"
          placeholder="Search anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Filter by genre..."
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Popular strip — only shown when no active search/genre filter */}
      {!debouncedSearch && !selectedGenre && (
        <>
          <h2 className="row-title">Popular Now</h2>
          <div className="row">
            {popularList.length === 0
              ? ROW_SKELETON_KEYS.map((key) => (
                  <div key={key} className="row-item skeleton-card" />
                ))
              : popularList.map((anime) => (
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
        </>
      )}

      <div className="section">
        <h2 className="section-title">Browse All</h2>

        {isLoading ? (
          <div className="grid">
            {GRID_SKELETON_KEYS.map((key) => (
              <div key={key} className="skeleton-card" />
            ))}
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : browseAnime.length === 0 ? (
          <p className="empty-message">No anime found.</p>
        ) : (
          <div className="grid">
            {browseAnime.map((anime) => (
              <AnimeCard
                key={anime.id}
                id={anime.id}
                title={anime.title}
                rating={anime.rating}
                image={anime.image}
                description={anime.description}
                genres={anime.genres}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {paginationMeta && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </button>
            <span>Page {paginationMeta.page}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!paginationMeta.hasNextPage || isLoading}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
