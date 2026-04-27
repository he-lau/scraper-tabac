const { Pool } = require("pg");

module.exports = async () => {
  // Créer la BDD de test si elle n'existe pas
  const admin = new Pool({ connectionString: process.env.DATABASE_URL });
  await admin.query(`
    SELECT 'CREATE DATABASE "scraper-tabac-test"'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'scraper-tabac-test')
  `).then(async (r) => {
    if (r.rows[0]) await admin.query(r.rows[0]["?column?"]);
  });
  await admin.end();

  // Créer les tables dans la BDD de test
  const test = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await test.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR UNIQUE NOT NULL,
      password VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      title VARCHAR,
      price FLOAT,
      city VARCHAR,
      source VARCHAR,
      fingerprint VARCHAR UNIQUE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, listing_id)
    );
  `);
  await test.end();
};
