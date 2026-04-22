const PORT = 8000;
const express = require("express");
const cors = require("cors");
const listingRoutes = require("./routes/listingRoutes");
const app = express();
const limiter = require("./middlewares/rateLimiter");

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

app.use(limiter);
app.use(express.json());

app.use("/api", listingRoutes);

app.use((req, res) => {
    res.status(404).send('Page not found');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});