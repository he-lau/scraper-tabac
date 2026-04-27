const favoriteModel = require("../models/favoriteModel");
const db = require("../db");

const getFavorites = async (req, res) => {
  const favorites = await favoriteModel.getByUser(req.user.id);
  res.json(favorites);
};

const addFavorite = async (req, res) => {
  const listingId = Number(req.params.id);
  if (!listingId || isNaN(listingId)) return res.status(400).json({ error: "ID invalide" });

  const listing = await db.query("SELECT id FROM listings WHERE id = $1", [listingId]);
  if (!listing.rows[0]) return res.status(404).json({ error: "Annonce introuvable" });

  const already = await favoriteModel.exists(req.user.id, listingId);
  if (already) return res.status(409).json({ error: "Déjà en favoris" });

  const favorite = await favoriteModel.add(req.user.id, listingId);
  res.status(201).json(favorite);
};

const removeFavorite = async (req, res) => {
  const listingId = Number(req.params.id);
  if (!listingId || isNaN(listingId)) return res.status(400).json({ error: "ID invalide" });

  const deleted = await favoriteModel.remove(req.user.id, listingId);
  if (!deleted) return res.status(404).json({ error: "Favori introuvable" });

  res.status(204).send();
};

module.exports = { getFavorites, addFavorite, removeFavorite };
