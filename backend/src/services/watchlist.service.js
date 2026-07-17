const fs = require("fs/promises");
const path = require("path");

const WATCHLISTS_FILE = path.join(__dirname, "..", "..", "data", "watchlists.json");
const ANIME_FILE = path.join(__dirname, "..", "..", "data", "anime.json");

async function readWatchlists() {
  try {
    const raw = await fs.readFile(WATCHLISTS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeWatchlists(data) {
  await fs.writeFile(WATCHLISTS_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function readAnime() {
  const raw = await fs.readFile(ANIME_FILE, "utf8");
  return JSON.parse(raw);
}

async function getWatchlist(userId) {
  const watchlists = await readWatchlists();
  const entry = watchlists[userId];
  if (!entry || !Array.isArray(entry.animeIds) || entry.animeIds.length === 0) {
    return [];
  }

  const animeList = await readAnime();
  const idSet = new Set(entry.animeIds);
  return animeList.filter((a) => idSet.has(a.id));
}

async function addToWatchlist(userId, animeId) {
  const watchlists = await readWatchlists();
  if (!watchlists[userId]) {
    watchlists[userId] = { animeIds: [] };
  }

  if (!watchlists[userId].animeIds.includes(animeId)) {
    watchlists[userId].animeIds.push(animeId);
    await writeWatchlists(watchlists);
  }
}

async function removeFromWatchlist(userId, animeId) {
  const watchlists = await readWatchlists();
  if (!watchlists[userId]) return;

  watchlists[userId].animeIds = watchlists[userId].animeIds.filter((id) => id !== animeId);
  await writeWatchlists(watchlists);
}

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
