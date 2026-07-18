const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../services/watchlist.service");

async function listWatchlist(req, res, next) {
  try {
    const userId = req.auth.sub;
    const items = await getWatchlist(userId);
    return res.json(items);
  } catch (error) {
    return next(error);
  }
}

async function addAnime(req, res, next) {
  try {
    const userId = req.auth.sub;
    const animeId = Number.parseInt(req.body?.animeId, 10);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({ message: "Valid animeId is required." });
    }

    await addToWatchlist(userId, animeId);
    return res.status(201).json({ message: "Added to watchlist." });
  } catch (error) {
    return next(error);
  }
}

async function removeAnime(req, res, next) {
  try {
    const userId = req.auth.sub;
    const animeId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(animeId)) {
      return res.status(400).json({ message: "Invalid anime id." });
    }

    await removeFromWatchlist(userId, animeId);
    return res.json({ message: "Removed from watchlist." });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listWatchlist, addAnime, removeAnime };
