const db = require("./db");

module.exports = async function migrate() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                          SERIAL PRIMARY KEY,
      email                       VARCHAR UNIQUE NOT NULL,
      password                    VARCHAR NOT NULL,
      verified                    BOOLEAN DEFAULT FALSE,
      verification_token          VARCHAR,
      verification_token_expires  TIMESTAMP,
      created_at                  TIMESTAMP DEFAULT NOW()
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS verified                   BOOLEAN DEFAULT FALSE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token         VARCHAR;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

    CREATE TABLE IF NOT EXISTS favorites (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, listing_id)
    );
  `);
  console.log("Migration OK");
};
