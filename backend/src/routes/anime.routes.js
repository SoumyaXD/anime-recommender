const express = require("express");
const { listAnime, getAnime } = require("../controllers/anime.controller");

const router = express.Router();

router.get("/", listAnime);
router.get("/:id", getAnime);

module.exports = router;
