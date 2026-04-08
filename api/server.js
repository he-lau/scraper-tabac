const PORT = 8000;
const express = require("express");
const listingRoutes = require("./routes/listingRoutes");
const app = express();

app.use(express.json());

app.use("api/listings", listingRoutes);

app.use((req, res) => {
    res.status(404).send('Page not found');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});