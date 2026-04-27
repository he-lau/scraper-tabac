const db = require("../db");

const findByEmail = (email) =>
  db.query("SELECT * FROM users WHERE email = $1", [email]).then((r) => r.rows[0]);

const create = (email, hashedPassword) =>
  db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, hashedPassword]
  ).then((r) => r.rows[0]);

module.exports = { findByEmail, create };
