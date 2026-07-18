const express = require("express");
const cors = require("cors");
const animeRoutes = require("./routes/anime.routes");
const authRoutes = require("./routes/auth.routes");
const watchlistRoutes = require("./routes/watchlist.routes");
const { notFoundMiddleware } = require("./middleware/not-found.middleware");
const { errorMiddleware } = require("./middleware/error.middleware");

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
