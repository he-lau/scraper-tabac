const Listing = require("../models/listingModel");

async function getListings(req, res) {
  try {
    const listings = await Listing.getAll();
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function createListing(req, res) {
  try {
    const listing = await Listing.create(req.body);
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  getListings,
  createListing
};