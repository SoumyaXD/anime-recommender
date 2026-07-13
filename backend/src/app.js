const express = require("express");
const cors = require("cors");
const animeRoutes = require("./routes/anime.routes");
const { notFoundMiddleware } = require("./middleware/not-found.middleware");
const { errorMiddleware } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/anime", animeRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
