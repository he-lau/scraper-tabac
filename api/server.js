const app = require("./app");
const migrate = require("./migrate");

const PORT = 8000;

migrate()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => { console.error("Migration failed:", err); process.exit(1); });
