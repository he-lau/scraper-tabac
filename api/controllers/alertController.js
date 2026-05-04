const alertModel = require("../models/alertModel");

const list = async (req, res) => {
  const alerts = await alertModel.findByUser(req.user.id);
  res.json({ alerts });
};

const create = async (req, res) => {
  const { name, keywords, source, priceMin, priceMax, region } = req.body;
  const alert = await alertModel.create(req.user.id, { name, keywords, source, priceMin, priceMax, region });
  res.status(201).json({ alert });
};

const update = async (req, res) => {
  const { name, keywords, source, priceMin, priceMax, region, active } = req.body;
  const alert = await alertModel.update(req.params.id, req.user.id, { name, keywords, source, priceMin, priceMax, region, active });
  if (!alert) return res.status(404).json({ error: "Alerte introuvable" });
  res.json({ alert });
};

const toggle = async (req, res) => {
  const alert = await alertModel.toggleActive(req.params.id, req.user.id);
  if (!alert) return res.status(404).json({ error: "Alerte introuvable" });
  res.json({ alert });
};

const remove = async (req, res) => {
  await alertModel.remove(req.params.id, req.user.id);
  res.json({ message: "Alerte supprimée" });
};

module.exports = { list, create, update, toggle, remove };
