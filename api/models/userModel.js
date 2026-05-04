const db = require("../db");

const findByEmail = (email) =>
  db.query("SELECT * FROM users WHERE email = $1", [email]).then((r) => r.rows[0]);

const create = (email, hashedPassword, verificationToken, verificationTokenExpires, firstName, lastName, gender) =>
  db.query(
    `INSERT INTO users (email, password, verified, verification_token, verification_token_expires, first_name, last_name, gender)
     VALUES ($1, $2, FALSE, $3, $4, $5, $6, $7)
     RETURNING id, email, created_at`,
    [email, hashedPassword, verificationToken, verificationTokenExpires, firstName || null, lastName || null, gender || null]
  ).then((r) => r.rows[0]);

const findByVerificationToken = (token) =>
  db.query("SELECT * FROM users WHERE verification_token = $1", [token]).then((r) => r.rows[0]);

const findById = (id) =>
  db.query("SELECT * FROM users WHERE id = $1", [id]).then((r) => r.rows[0]);

const updateProfile = (id, firstName, lastName) =>
  db.query(
    "UPDATE users SET first_name = $2, last_name = $3 WHERE id = $1 RETURNING id, email, first_name, last_name, gender",
    [id, firstName || null, lastName || null]
  ).then((r) => r.rows[0]);

const updatePassword = (id, hashedPassword) =>
  db.query("UPDATE users SET password = $2 WHERE id = $1", [id, hashedPassword]);

const deleteUser = (id) =>
  db.query("DELETE FROM users WHERE id = $1", [id]);

const markAsVerified = (id) =>
  db.query(
    "UPDATE users SET verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1",
    [id]
  );

const updateVerificationToken = (email, token, expires) =>
  db.query(
    "UPDATE users SET verification_token = $2, verification_token_expires = $3 WHERE email = $1",
    [email, token, expires]
  );

module.exports = { findByEmail, findById, create, findByVerificationToken, markAsVerified, updateVerificationToken, updateProfile, updatePassword, deleteUser };
