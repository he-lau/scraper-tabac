const db = require("../db");

const findByEmail = (email) =>
  db.query("SELECT * FROM users WHERE email = $1", [email]).then((r) => r.rows[0]);

const create = (email, hashedPassword, verificationToken, verificationTokenExpires) =>
  db.query(
    `INSERT INTO users (email, password, verified, verification_token, verification_token_expires)
     VALUES ($1, $2, FALSE, $3, $4)
     RETURNING id, email, created_at`,
    [email, hashedPassword, verificationToken, verificationTokenExpires]
  ).then((r) => r.rows[0]);

const findByVerificationToken = (token) =>
  db.query("SELECT * FROM users WHERE verification_token = $1", [token]).then((r) => r.rows[0]);

const markAsVerified = (id) =>
  db.query(
    "UPDATE users SET verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1",
    [id]
  );

module.exports = { findByEmail, create, findByVerificationToken, markAsVerified };
