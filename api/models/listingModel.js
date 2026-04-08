const pool = require("../db");

async function getAll() {
  const result = await pool.query("SELECT * FROM listings");
  return result.rows;
}
/*
async function create(data) {
  const query = `
    INSERT INTO listings (title, price, city, fingerprint)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [data.title, data.price, data.city, data.fingerprint];

  const result = await pool.query(query, values);
  return result.rows[0];
}
*/
module.exports = {
  getAll,
 // create
};