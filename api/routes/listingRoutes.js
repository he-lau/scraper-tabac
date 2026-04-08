const express = require("express");
const router = express.Router();
const controller = require("../controllers/listingController");

router.get("/", controller.getListings);
//router.post("/", controller.createListing);

module.exports = router;