const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  message: { error: "Trop de requêtes, réessayez plus tard" },
});

module.exports = limiter;