const db = require("../db");

const getByUser = (userId) =>
  db.query(
    `SELECT l.* FROM listings l
     JOIN favorites f ON f.listing_id = l.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  ).then((r) => r.rows);

const add = (userId, listingId) =>
  db.query(
    "INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2) RETURNING *",
    [userId, listingId]
  ).then((r) => r.rows[0]);

const remove = (userId, listingId) =>
  db.query(
    "DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2",
    [userId, listingId]
  ).then((r) => r.rowCount);

const exists = (userId, listingId) =>
  db.query(
    "SELECT 1 FROM favorites WHERE user_id = $1 AND listing_id = $2",
    [userId, listingId]
  ).then((r) => r.rowCount > 0);

module.exports = { getByUser, add, remove, exists };
