import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAnimeById } from "../services/api";
import "./Details.css";

function Details() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDetails() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAnimeById(id);
        if (isActive) setAnime(data);
      } catch (err) {
        if (isActive) setError(err instanceof Error ? err.message : "Failed to load details.");
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) return <div className="details-page">Loading anime details...</div>;
  if (error) return <div className="details-page details-error">{error}</div>;
  if (!anime) return <div className="details-page details-error">Anime not found.</div>;

  const gallery = Array.isArray(anime.images) ? anime.images : [];
  const genres = Array.isArray(anime.genres) ? anime.genres : [];

  return (
    <div className="details-page">
      <h1 className="details-title">{anime.title}</h1>

      <div className="details-main">
        <img className="details-poster" src={anime.image} alt={anime.title} />

        <div className="details-content">
          <p>
            <strong>Rating:</strong> {anime.rating ?? "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {anime.status || "Unknown"}
          </p>
          <p>
            <strong>Episodes:</strong> {anime.episodes ?? "Unknown"}
          </p>
          <p>
            <strong>Year:</strong> {anime.year ?? "Unknown"}
          </p>
          <p className="details-description">{anime.description || "Description not available."}</p>
          <div className="details-genres">
            {genres.length === 0
              ? "Genre: Unknown"
              : genres.map((genre) => (
                  <span key={genre} className="genre-pill">
                    {genre}
                  </span>
                ))}
          </div>
        </div>
      </div>

      <h2 className="details-gallery-title">Posters and Images</h2>
      <div className="details-gallery">
        {gallery.length === 0 ? (
          <p>No extra images available.</p>
        ) : (
          gallery.map((src) => <img key={src} src={src} alt={`${anime.title} poster`} loading="lazy" />)
        )}
      </div>
    </div>
  );
}

export default Details;
