const express = require("express");
const router = express.Router();
const controller = require("../controllers/listingController");

router.get("/listings", controller.getListings);
router.get("/listings/:id", controller.getListingById);

module.exports = router;