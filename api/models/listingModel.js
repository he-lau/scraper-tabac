const pool = require("../db");

async function getAll(filters = {}) {
  const {
    city,
    name,
    limit,
    offset = 0,
    all = false,
    orderBy = "created_at",
    order = "DESC",
  } = filters;

  let query = "SELECT * FROM listings";
  const conditions = [];
  const values = [];

  // Filters
  if (city) {
    values.push(city);
    conditions.push(`city ILIKE $${values.length}`);
  }

  if (name) {
    values.push(`%${name}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // ORDER BY sécurisé
  const allowedOrderFields = ["created_at", "price", "city", "name"];
  const safeOrderBy = allowedOrderFields.includes(orderBy)
    ? orderBy
    : "created_at";

  const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  query += ` ORDER BY ${safeOrderBy} ${safeOrder}`;

  // LIMIT / ALL
  if (!all) {
    const safeLimit = Math.min(parseInt(limit) || 50, 100);
    values.push(safeLimit);
    query += ` LIMIT $${values.length}`;

    values.push(offset);
    query += ` OFFSET $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
}

async function getById(id) {
  const result = await pool.query("SELECT * FROM listings WHERE id = $1", [id]);
  return result.rows[0] || null;
}

module.exports = {
  getAll,
  getById
};