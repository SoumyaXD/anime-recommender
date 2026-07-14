/**
 * Convert an anime object into a binary vector using a shared genre index.
 * Each position in the vector maps to a genre in allGenres.
 * The value is 1 when the anime has that genre and 0 otherwise.
 */
function animeToVector(anime, allGenres) {
  const animeGenres = Array.isArray(anime?.genres) ? anime.genres : [];
  return allGenres.map((genre) => (animeGenres.includes(genre) ? 1 : 0));
}

/**
 * Calculate cosine similarity between two vectors.
 * similarity = (A · B) / (||A|| × ||B||)
 * Returns 0 when either vector has zero magnitude.
 */
function cosineSimilarity(vec1, vec2) {
  if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
    return 0;
  }

  const dotProduct = vec1.reduce((sum, value, index) => sum + value * vec2[index], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, value) => sum + value * value, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, value) => sum + value * value, 0));

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Normalize similarity scores to a 0-1 range with min-max normalization.
 */
function normalizeScores(recommendations) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return [];
  }

  const similarities = recommendations.map((item) => item.similarity_score || 0);
  const minScore = Math.min(...similarities);
  const maxScore = Math.max(...similarities);

  if (maxScore === minScore) {
    return recommendations.map((item) => ({
      ...item,
      similarity_score: maxScore > 0 ? 1 : 0,
    }));
  }

  return recommendations.map((item) => ({
    ...item,
    similarity_score: (item.similarity_score - minScore) / (maxScore - minScore),
  }));
}

/**
 * Apply optional recommendation filters and return ranked results.
 */
function filterAndRank(recommendations, filters = {}) {
  if (!Array.isArray(recommendations)) {
    return [];
  }

  const {
    minRating,
    minYear,
    maxYear,
    status,
    minEpisodes,
    maxEpisodes,
  } = filters;

  return recommendations
    .filter((anime) => {
      if (Number.isFinite(minRating) && Number(anime.rating) < minRating) return false;
      if (Number.isFinite(minYear) && Number(anime.year) < minYear) return false;
      if (Number.isFinite(maxYear) && Number(anime.year) > maxYear) return false;
      if (Number.isFinite(minEpisodes) && Number(anime.episodes) < minEpisodes) return false;
      if (Number.isFinite(maxEpisodes) && Number(anime.episodes) > maxEpisodes) return false;

      if (status && anime.status !== status) return false;

      return true;
    })
    .sort((a, b) => b.similarity_score - a.similarity_score);
}

/**
 * Build content-based recommendations by:
 * 1) creating genre vectors for watched anime,
 * 2) averaging them into a user preference vector,
 * 3) comparing all unseen anime using cosine similarity,
 * 4) ranking and returning the top N.
 */
function getRecommendations(watchedAnimes, allAnimes, topN = 10) {
  if (!Array.isArray(watchedAnimes) || watchedAnimes.length === 0 || !Array.isArray(allAnimes)) {
    return [];
  }

  const watchedIds = new Set(watchedAnimes.map((anime) => anime.id));
  const watchedGenres = [...new Set(watchedAnimes.flatMap((anime) => anime.genres || []))];

  if (watchedGenres.length === 0) {
    return [];
  }

  const watchedVectors = watchedAnimes.map((anime) => animeToVector(anime, watchedGenres));
  const userVector = new Array(watchedGenres.length).fill(0);

  watchedVectors.forEach((vector) => {
    vector.forEach((value, index) => {
      userVector[index] += value;
    });
  });

  const averagedUserVector = userVector.map((value) => value / watchedVectors.length);

  const scored = allAnimes
    .filter((anime) => !watchedIds.has(anime.id))
    .map((anime) => {
      const animeVector = animeToVector(anime, watchedGenres);
      const similarity = cosineSimilarity(averagedUserVector, animeVector);
      const matchingGenres = (anime.genres || []).filter((genre) => watchedGenres.includes(genre));

      return {
        id: anime.id,
        title: anime.title,
        image: anime.image,
        rating: anime.rating,
        genres: anime.genres,
        year: anime.year,
        status: anime.status,
        episodes: anime.episodes,
        similarity_score: similarity,
        matching_genres: matchingGenres,
      };
    });

  const normalized = normalizeScores(scored);

  return normalized
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, topN);
}

module.exports = {
  animeToVector,
  cosineSimilarity,
  getRecommendations,
  normalizeScores,
  filterAndRank,
};
