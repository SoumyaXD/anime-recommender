const fs = require("fs/promises");
const path = require("path");

const ANIME_DATA_FILE = path.join(__dirname, "..", "..", "data", "anime.json");

async function readAnimeData() {
  const raw = await fs.readFile(ANIME_DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function getAllAnime({ page = 1, limit = 20, search = "", genre = "" } = {}) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));

  let anime = await readAnimeData();

  if (search) {
    const term = search.toLowerCase();
    anime = anime.filter((a) => a.title?.toLowerCase().includes(term));
  }

  if (genre) {
    const term = genre.toLowerCase();
    anime = anime.filter(
      (a) => Array.isArray(a.genres) && a.genres.some((g) => g.toLowerCase().includes(term))
    );
  }

  const total = anime.length;
  const offset = (safePage - 1) * safeLimit;
  const data = anime.slice(offset, offset + safeLimit);

  return {
    data,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      hasNextPage: offset + safeLimit < total,
    },
  };
}

async function getAnimeById(id) {
  const animeList = await readAnimeData();
  return animeList.find((anime) => anime.id === id) || null;
}

module.exports = {
  getAllAnime,
  getAnimeById,
};
