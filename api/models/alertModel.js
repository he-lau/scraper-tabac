const db = require("../db");

const findByUser = (userId) =>
  db.query("SELECT * FROM alerts WHERE user_id = $1 ORDER BY created_at DESC", [userId])
    .then((r) => r.rows);

const create = (userId, { name, keywords, source, priceMin, priceMax, region }) =>
  db.query(
    `INSERT INTO alerts (user_id, name, keywords, source, price_min, price_max, region)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, name || null, keywords || null, source || null, priceMin || null, priceMax || null, region || null]
  ).then((r) => r.rows[0]);

const update = (id, userId, { name, keywords, source, priceMin, priceMax, region, active }) =>
  db.query(
    `UPDATE alerts SET name=$3, keywords=$4, source=$5, price_min=$6, price_max=$7, region=$8, active=$9
     WHERE id=$1 AND user_id=$2 RETURNING *`,
    [id, userId, name || null, keywords || null, source || null, priceMin || null, priceMax || null, region || null, active]
  ).then((r) => r.rows[0]);

const toggleActive = (id, userId) =>
  db.query(
    "UPDATE alerts SET active = NOT active WHERE id=$1 AND user_id=$2 RETURNING *",
    [id, userId]
  ).then((r) => r.rows[0]);

const remove = (id, userId) =>
  db.query("DELETE FROM alerts WHERE id=$1 AND user_id=$2", [id, userId]);

module.exports = { findByUser, create, update, toggleActive, remove };
