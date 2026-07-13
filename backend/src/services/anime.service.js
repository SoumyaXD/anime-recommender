const fs = require("fs/promises");
const path = require("path");

const ANIME_DATA_FILE = path.join(__dirname, "..", "..", "data", "anime.json");

async function readAnimeData() {
  const raw = await fs.readFile(ANIME_DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function getAllAnime() {
  return readAnimeData();
}

async function getAnimeById(id) {
  const animeList = await readAnimeData();
  return animeList.find((anime) => anime.id === id) || null;
}

module.exports = {
  getAllAnime,
  getAnimeById,
};
