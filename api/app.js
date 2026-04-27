const express = require("express");
const cors = require("cors");
const limiter = require("./middlewares/rateLimiter");
const listingRoutes = require("./routes/listingRoutes");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

app.use(limiter);
app.use(express.json());

app.use("/api", listingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

module.exports = app;
