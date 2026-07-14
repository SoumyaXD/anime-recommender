const { getAllAnime } = require("../services/anime.service");
const {
  getRecommendations: buildRecommendations,
  filterAndRank,
} = require("../services/recommendation.service");

function parseNumber(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function getRecommendations(req, res, next) {
  try {
    const { animeIds, topN = 10, filters = {} } = req.body || {};

    if (!Array.isArray(animeIds)) {
      return res.status(400).json({ message: "animeIds must be an array of anime IDs." });
    }

    if (animeIds.length === 0) {
      return res.json({
        recommendations: [],
        message: "Add anime to watchlist to get recommendations",
      });
    }

    const normalizedIds = animeIds.map((id) => Number.parseInt(id, 10));
    const invalidIds = animeIds.filter((_, index) => !Number.isInteger(normalizedIds[index]));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Invalid anime IDs provided.",
        invalidAnimeIds: invalidIds,
      });
    }

    const allAnimes = await getAllAnime();
    const animeIdSet = new Set(allAnimes.map((anime) => anime.id));

    const missingIds = [...new Set(normalizedIds.filter((id) => !animeIdSet.has(id)))];
    if (missingIds.length > 0) {
      return res.status(400).json({
        message: "Some anime IDs were not found.",
        missingAnimeIds: missingIds,
      });
    }

    const watchedIdSet = new Set(normalizedIds);
    const watchedAnimes = allAnimes.filter((anime) => watchedIdSet.has(anime.id));

    const safeTopN = Math.max(0, Number.parseInt(topN, 10) || 10);
    const normalizedFilters = {
      minRating: parseNumber(filters.minRating),
      minYear: parseNumber(filters.minYear),
      maxYear: parseNumber(filters.maxYear),
      status: typeof filters.status === "string" && filters.status.trim() ? filters.status.trim() : undefined,
      minEpisodes: parseNumber(filters.minEpisodes),
      maxEpisodes: parseNumber(filters.maxEpisodes),
    };

    const rawRecommendations = buildRecommendations(watchedAnimes, allAnimes, allAnimes.length);
    const rankedRecommendations = filterAndRank(rawRecommendations, normalizedFilters).slice(0, safeTopN);

    return res.json({
      recommendations: rankedRecommendations,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRecommendations,
};
