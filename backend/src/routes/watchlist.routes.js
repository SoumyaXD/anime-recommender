const express = require("express");
const { listWatchlist, addAnime, removeAnime } = require("../controllers/watchlist.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

// All watchlist routes require a valid JWT
router.use(requireAuth);

router.get("/", listWatchlist);
router.post("/", addAnime);
router.delete("/:id", removeAnime);

module.exports = router;
