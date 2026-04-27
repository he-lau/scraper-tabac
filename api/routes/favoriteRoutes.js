const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", favoriteController.getFavorites);
router.post("/:id", favoriteController.addFavorite);
router.delete("/:id", favoriteController.removeFavorite);

module.exports = router;
