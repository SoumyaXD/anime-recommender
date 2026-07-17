const { getAllAnime, getAnimeById } = require("../services/anime.service");

async function listAnime(req, res, next) {
  try {
    const { page, limit, q: search, genre } = req.query;
    const result = await getAllAnime({ page, limit, search, genre });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getAnime(req, res, next) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid anime id." });
    }

    const anime = await getAnimeById(id);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }

    return res.json(anime);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listAnime,
  getAnime,
};
