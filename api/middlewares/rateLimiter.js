const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: "Trop de requêtes, réessayez plus tard" },
  validate: { xForwardedForHeader: false },
});

module.exports = limiter;