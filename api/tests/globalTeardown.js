const { Pool } = require("pg");

module.exports = async () => {
  const test = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await test.query("TRUNCATE users, listings, favorites RESTART IDENTITY CASCADE");
  await test.end();
};
