const Listing = require("../models/listingModel");

const ALLOWED_ORDER_FIELDS = ["created_at", "price", "city", "name"];

async function getListings(req, res) {
  const { city, name, limit, offset, order, orderBy, all } = req.query;

  // Validation
  if (limit && (isNaN(limit) || Number(limit) < 1)) {
    return res.status(400).json({ error: "Invalid limit" });
  }

  if (offset && (isNaN(offset) || Number(offset) < 0)) {
    return res.status(400).json({ error: "Invalid offset" });
  }

  if (order && !["ASC", "DESC"].includes(order.toUpperCase())) {
    return res.status(400).json({ error: "Invalid order" });
  }

  if (orderBy && !ALLOWED_ORDER_FIELDS.includes(orderBy)) {
    return res.status(400).json({ error: "Invalid orderBy field" });
  }


  try {
    const listings = await Listing.getAll(req.query);
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getListingById(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id) || Number(id) < 1) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const listing = await Listing.getById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).send(err.message);
  }
}


module.exports = {
  getListings,
  getListingById
};